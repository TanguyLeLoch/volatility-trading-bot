import { Model } from 'mongoose';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order, OrderStatus, OrderPrice, PriceType, Side } from '@model/order';
import { Plan } from '@model/plan';
import { Method, ModuleCallerSvc } from '@app/core';
import { Pair } from '@model/common';
import { Exchange, GetOrderRequest } from '@model/network';
import { OrderSvc } from './order.service';

@Injectable()
export class SyncOrderSvc {
  private readonly logger = new Logger(SyncOrderSvc.name);

  constructor(
    private readonly orderSvc: OrderSvc,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async synchronize(planId: string): Promise<any> {
    // get all orders for plan
    const ordersDb = await this.orderSvc.findByPlanId(planId);
    this.logger.log(`Found ${ordersDb.length} orders`);
    const plan = await this.moduleCallerSvc.callModule(
      'plan',
      Method.GET,
      `plans/${planId}`,
      null,
    );
    // get all orders for plan from dex
    const request: GetOrderRequest = {
      planId,
      platform: plan.platform,
      pair: plan.pair,
    };

    const ordersDex = await this.moduleCallerSvc.callModule(
      'network',
      Method.POST,
      'dex/orders',
      request,
    );
    ordersDex.forEach((order: Order) => {
      if (order.status !== OrderStatus.NEW) {
        throw new Error(`Order ${JSON.stringify(order)} is not new`);
      }
    });
    this.logger.log(`Found ${ordersDex.length} orders on dex`);
    if (ordersDb.length < ordersDex.length) {
      throw new Error(`There is more orders on dex than in database`);
    }
    const exchanges: Exchange[] = [];
    if (ordersDb.length > ordersDex.length) {
      this.logger.log(
        `${
          ordersDb.length - ordersDex.length
        } orders seems to have been triggered`,
      );
      let i = 0;
      for (const order of ordersDb) {
        this.logger.verbose(`Treating order [${++i}/${ordersDb.length}]`);
        const orderDex = ordersDex.find((o: Order) => o._id === order._id);
        if (!orderDex) {
          this.logger.log(
            `Order ${order._id} is not on dex, we assume it was triggered`,
          );
          const exchange: Exchange = await this.createOrderAfterTrigger(
            order,
            plan,
          );
          exchanges.push(exchange);
        }
      }
    } else {
      this.logger.log(`DB and dex orders seems to be in sync`);
    }

    return exchanges;
  }

  async createOrderAfterTrigger(order: Order, plan: Plan): Promise<Exchange> {
    const steps = plan.stepLevels;
    const newOrder = new Order();
    const idxStep = findClosestNumberIdx(steps, order.price.value);
    if (order.side === Side.BUY) {
      newOrder.side = Side.SELL;
      newOrder.price = { value: steps[idxStep + 1], type: PriceType.LIMIT };
    } else {
      newOrder.side = Side.BUY;
      newOrder.price = { value: steps[idxStep - 1], type: PriceType.LIMIT };
    }
    newOrder.amount = order.amount;
    newOrder.planId = order.planId;
    newOrder.pair = order.pair;
    newOrder.status = OrderStatus.NEW;

    this.logger.debug(
      `Creating order in database: ${JSON.stringify(newOrder)}`,
    );
    const orderDb = await this.orderSvc.create(newOrder);
    this.logger.log(`Order ${orderDb._id} created in database`);
    // create order in dex
    const ordersDex: Exchange[] = await this.moduleCallerSvc.callModule(
      'network',
      Method.POST,
      'dex/postOrders',
      [orderDb],
    );
    this.logger.log(`Order ${ordersDex[0]._id} created on dex`);
    return ordersDex[0];
  }
}
function findClosestNumberIdx(
  steps: Array<number>,
  valueToFound: number,
): number {
  let closest = steps[0];
  for (const step of steps) {
    if (Math.abs(step - valueToFound) < Math.abs(closest - valueToFound)) {
      closest = step;
    }
  }
  return steps.indexOf(closest);
}
