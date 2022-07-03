import { Injectable, Logger } from '@nestjs/common';
import { Order, OrderStatus, PriceType, Side } from '@model/order';
import { Plan } from '@model/plan';
import { Method, ModuleCallerSvc } from '@app/core';
import { Exchange, GetOrderRequest } from '@model/network';
import { OrderSvc } from './order.service';

@Injectable()
export class SyncOrderSvc {
  private readonly logger = new Logger(SyncOrderSvc.name);

  constructor(private readonly orderSvc: OrderSvc, private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async synchronize(planId: string): Promise<any> {
    const ordersDb = await this.orderSvc.findByPlanId(planId, { status: OrderStatus.NEW });
    this.logger.log(`Found ${ordersDb.length} orders`);
    const plan = await this.getPlan(planId);
    // get all orders for plan from cex
    const request: GetOrderRequest = this.createOrderRequestByPlan(planId, plan);

    const ordersCex = await this.moduleCallerSvc.callModule('network', Method.POST, 'cex/orders', request);
    this.checkOrders(ordersCex, ordersDb);
    const exchanges: Exchange[] = [];
    if (ordersDb.length > ordersCex.length) {
      this.logger.log(`${ordersDb.length - ordersCex.length} orders seems to have been triggered`);
      let i = 0;
      for (const order of ordersDb) {
        this.logger.verbose(`Treating order [${++i}/${ordersDb.length}]`);
        const orderCex = ordersCex.find((o: Order) => o._id === order._id);
        if (!orderCex) {
          this.logger.log(`Order ${order._id} is not on cex, we assume it was triggered`);
          const exchange: Exchange = await this.createOrderAfterTrigger(order, plan);
          exchanges.push(exchange);
        }
      }
    } else {
      this.logger.log(`DB and cex orders seems to be in sync`);
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

    this.logger.debug(`Creating order in database: ${JSON.stringify(newOrder)}`);
    const orderDb = await this.orderSvc.create(newOrder);
    this.logger.log(`Order ${orderDb._id} created in database`);
    // create order in cex
    const ordersCex: Exchange[] = await this.moduleCallerSvc.callModule('network', Method.POST, 'cex/postOrders', [
      orderDb,
    ]);
    this.logger.log(`Order ${ordersCex[0]._id} created on cex`);
    return ordersCex[0];
  }
  private createOrderRequestByPlan(planId: string, plan: any): GetOrderRequest {
    return {
      planId,
      platform: plan.platform,
      pair: plan.pair,
    };
  }

  private async getPlan(planId: string) {
    return await this.moduleCallerSvc.callModule('plan', Method.GET, `plans/${planId}`, null);
  }

  private checkOrders(ordersCex: any, ordersDb: Order[]) {
    ordersCex.forEach((order: Order) => {
      if (order.status !== OrderStatus.NEW) {
        throw new Error(`Order ${JSON.stringify(order)} is not new`);
      }
    });
    this.logger.log(`Found ${ordersCex.length} orders on cex`);
    if (ordersDb.length < ordersCex.length) {
      throw new Error(`There is more orders on cex than in database`);
    }
  }
}
function findClosestNumberIdx(steps: Array<number>, valueToFound: number): number {
  let closest = steps[0];
  for (const step of steps) {
    if (Math.abs(step - valueToFound) < Math.abs(closest - valueToFound)) {
      closest = step;
    }
  }
  return steps.indexOf(closest);
}
