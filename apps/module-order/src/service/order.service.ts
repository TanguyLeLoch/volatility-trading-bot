import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus, OrderPrice, PriceType, Side } from '@model/order';
import { Plan } from '@model/plan';
import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Pair, Utils } from '@model/common';
import winston from 'winston';
import { moduleName } from '../module.info';

@Injectable()
export class OrderSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, OrderSvc.name);

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async findById(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }
  async findByPlanId(planId: string, filter?: any): Promise<Order[]> {
    return await this.orderModel.find({ planId, ...filter }).exec();
  }

  async createByPlan(plan: Plan): Promise<Array<Order>> {
    this.logger.info(`Creating orders for plan ${plan._id}`);
    plan.pair = new Pair(plan.pair);

    const { price: currentpriceStr } = await this.moduleCallerSvc.callModule('network', Method.POST, 'cex/price', {
      pair: plan.pair,
      platform: plan.platform,
    });
    const currentprice = Number(currentpriceStr);
    this.logger.info(`Current price for ${plan.pair.toString()} is ${currentprice}`);
    this.logger.info(typeof currentprice);
    const orders: Array<Order> = [];
    const firstMarketOrder = createFirstMarketOrder(plan);
    orders.push(firstMarketOrder);
    for (const stepLevel of plan.stepLevels) {
      orders.push(createOrder(plan, stepLevel, currentprice, firstMarketOrder));
    }
    if (firstMarketOrder.amount > 0) {
      let orderToRemove: Order;
      for (const order of orders) {
        if (order.side === Side.SELL) {
          orderToRemove = order;
          firstMarketOrder.amount -= order.amount;
          break;
        }
      }
      orders.splice(orders.indexOf(orderToRemove), 1);
      firstMarketOrder.amount = Utils.roundAmount(firstMarketOrder.amount, 5);
    } else {
      throw new Error('Price is below last step level');
    }
    // save orders in db
    this.logger.info(`Saving ${orders.length} orders`);
    const createdOrders = await Promise.all(orders.map((order) => this.create(order)));
    // send orders to CEX
    const sentOrders = await this.moduleCallerSvc.callModule('network', Method.POST, 'cex/postOrders', createdOrders);

    await this.markMarketOrdersAsFilled(createdOrders);

    return sentOrders;
  }

  private async markMarketOrdersAsFilled(createdOrders: Order[]) {
    const marketOrdersSaved: Order[] = createdOrders.filter((order) => order.price.type === PriceType.MARKET);
    const modifiedOrder = [];
    for (const order of marketOrdersSaved) {
      modifiedOrder.push(await this.markAsFilled(order));
      this.logger.info(`Marked order ${order._id} as filled`);
    }
    for (const order of modifiedOrder) {
      //delete from list
      createdOrders.splice(createdOrders.indexOf(order), 1);
    }
  }
  async markAsFilled(order: Order): Promise<Order> {
    order.status = OrderStatus.FILLED;
    return this.modify(order);
  }
  async modify(order: Order): Promise<Order> {
    return this.orderModel.findByIdAndUpdate(order._id, order, { new: true }).exec();
  }

  async findAll(): Promise<Array<Order>> {
    return this.orderModel.find().exec();
  }

  async create(order: Order): Promise<Order> {
    const existingsOrder: Order[] = await this.orderModel
      .find({ status: OrderStatus.NEW, price: order.price, pair: order.pair })
      .exec();

    if (existingsOrder.length > 0) {
      this.logger.info(`Order already exists for price ${order.price.value}`);
      return existingsOrder[0];
    } else {
      const orderCreated = new this.orderModel(order);
      return orderCreated.save();
    }
  }

  async delete(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
  async deleteAll(): Promise<void> {
    await this.orderModel.deleteMany({}).exec();
  }
}

function createFirstMarketOrder(plan: Plan): Order {
  const order = new Order();
  order.planId = plan._id;
  order.pair = plan.pair;
  const price: OrderPrice = {} as OrderPrice;
  price.type = PriceType.MARKET;
  order.status = OrderStatus.NEW;
  order.price = price;
  order.side = Side.BUY;
  order.amount = 0;
  return order;
}

function createOrder(plan: Plan, stepLevel: number, currentprice: number, firstMarketOrder: Order): Order {
  const order = new Order();
  order.planId = plan._id;
  order.pair = plan.pair;
  const price: OrderPrice = {} as OrderPrice;
  order.status = OrderStatus.NEW;
  price.type = PriceType.LIMIT;
  price.value = stepLevel;
  order.price = price;
  order.amount = plan.amountPerStep;
  if (order.price.value > currentprice) {
    order.side = Side.SELL;
    firstMarketOrder.amount += order.amount;
  } else {
    order.side = Side.BUY;
  }
  return order;
}
