import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus, OrderPrice, PriceType, Side } from '@model/order';
import { Plan } from '@model/plan';
import { Method, ModuleCallerSvc } from '@app/core';
import { Pair } from '@model/common';

@Injectable()
export class OrderSvc {
  private readonly logger = new Logger(OrderSvc.name);

  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async findById(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async createByPlan(plan: Plan): Promise<Array<Order>> {
    this.logger.log(`Creating orders for plan ${plan._id}`);
    plan.pair = new Pair(plan.pair);
    const { price: currentprice } = await this.moduleCallerSvc.callModule(
      'network',
      Method.POST,
      'dex/price',
      { pair: plan.pair, platform: plan.platform },
    );
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
    } else {
      throw new Error('Price is above last step level');
    }
    // save orders in db
    this.logger.log(`Saving ${orders.length} orders`);
    const createdOrders = await Promise.all(
      orders.map((order) => this.create(order)),
    );
    return createdOrders;
  }

  async modify(order: Order): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(order._id, order, { new: true })
      .exec();
  }

  async findAll(): Promise<Array<Order>> {
    return this.orderModel.find().exec();
  }

  async create(order: Order): Promise<Order> {
    const createdOrder = new this.orderModel(order);
    return createdOrder.save();
  }

  async delete(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
function createFirstMarketOrder(plan: Plan): Order {
  const order = new Order();
  order.planId = plan._id;
  order.pair = plan.pair;
  const price: OrderPrice = {} as OrderPrice;
  price.type = PriceType.MARKET;
  order.status = OrderStatus.OPEN;
  order.price = price;
  order.side = Side.BUY;
  order.amount = 0;
  return order;
}

function createOrder(
  plan: Plan,
  stepLevel: number,
  currentprice: number,
  firstMarketOrder: Order,
): Order {
  const order = new Order();
  order.planId = plan._id;
  order.pair = plan.pair;
  const price: OrderPrice = {} as OrderPrice;
  order.status = OrderStatus.OPEN;
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
