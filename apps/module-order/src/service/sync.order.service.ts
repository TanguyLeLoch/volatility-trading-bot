import { Injectable, Logger } from '@nestjs/common';
import { Order, OrderStatus, PriceType, Side } from '@model/order';
import { Plan } from '@model/plan';
import { logger, Method, ModuleCallerSvc } from '@app/core';
import { Exchange, GetOrderRequest } from '@model/network';
import { OrderSvc } from './order.service';

@Injectable()
export class SyncOrderSvc {
  private readonly logger = new Logger(SyncOrderSvc.name);
  private readonly logger2 = logger;

  constructor(private readonly orderSvc: OrderSvc, private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async synchronize(planId: string): Promise<any> {
    const ordersDb = await this.orderSvc.findByPlanId(planId, { status: OrderStatus.NEW });
    this.logger.debug(`Found ${ordersDb.length} orders in database at NEW status`);
    const plan = await this.getPlan(planId);
    // get all orders for plan from cex
    const request: GetOrderRequest = this.createOrderRequestByPlan(planId, plan);
    const ordersCex = await this.moduleCallerSvc.callModule('network', Method.POST, 'cex/orders', request);
    this.logger.verbose(`ordersCex: ${JSON.stringify(ordersCex)}`);
    this.checkOrders(ordersCex, ordersDb);
    const exchanges: Exchange[] = [];
    const desyncOrders: Order[] = getDesyncOrders(ordersDb, ordersCex);
    if (desyncOrders.length > 0) {
      for (const desyncOrder of desyncOrders) {
        this.logger.log(`Order ${desyncOrder._id} is not on cex, we assume it was triggered`);
        this.logger2.info(`Order ${desyncOrder._id} is not on cex, we assume it was triggered`);
        await this.orderSvc.markAsFilled(desyncOrder);
        const exchange: Exchange = await this.createOrderAfterTrigger(desyncOrder, plan);
        exchanges.push(exchange);
      }
    } else {
      this.logger.log(`DB and cex orders are synced`);
      this.logger2.info(`DB and cex orders are synced`);
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
function getDesyncOrders(ordersDb: Order[], ordersCex: any): Order[] {
  const desyncOrders: Order[] = [];
  ordersDb.forEach((order: Order) => {
    const orderCex = ordersCex.find((orderCex: Order) => orderCex._id == order._id);
    if (!orderCex) {
      desyncOrders.push(order);
    }
  });
  return desyncOrders;
}
