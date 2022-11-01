import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Utils } from '@model/common';
import { DiscordMessage, DiscordMessageType } from '@model/discord';
import { Exchange, GetOrdersRequest, PostOrderRequest } from '@model/network';
import { Order, OrderBuilder, OrderStatus, PriceType, Side } from '@model/order';
import { Plan } from '@model/plan';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { OrderSvc } from './order.service';
import { SyncOrderCheckSvc } from './sync.order.check.service';

const OPEN_STATUS = [OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED];

@Injectable()
export class SyncOrderSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, SyncOrderSvc.name);

  constructor(
    private readonly orderSvc: OrderSvc,
    private readonly moduleCallerSvc: ModuleCallerSvc,
    private readonly syncOrderCheckSvc: SyncOrderCheckSvc,
  ) {}

  async synchronize(planId: string): Promise<any> {
    const ordersDb = await this.orderSvc.findByPlanId(planId, { status: OPEN_STATUS });
    this.logger.debug(`Found ${ordersDb.length} orders in database at NEW status`);
    const plan: Plan = await this.getPlan(planId);
    // get all orders for plan from cex
    const request: GetOrdersRequest = this.createOrderRequestByPlan(planId, plan);
    const ordersCex: Order[] = await this.moduleCallerSvc.callNetworkModule(Method.POST, 'cex/orders', request);
    this.logger.verbose(`ordersCex: ${JSON.stringify(ordersCex)}`);
    this.syncOrderCheckSvc.checkOrders(ordersCex, ordersDb);
    const triggerredOrders: Order[] = getDesyncOrdersSorted(ordersDb, ordersCex);
    if (triggerredOrders.length === 0) {
      this.logger.info(`DB and cex orders are synced`);
      this.postDiscordSyncMessage(plan);
      return [];
    }
    this.logger.warn(`${triggerredOrders.length} orders are not on cex, they has been triggered`);
    const triggerMessage: DiscordMessage = { type: DiscordMessageType.TRIGGER, params: { orders: triggerredOrders } };
    this.moduleCallerSvc.postMessageWithParamsOnDiscord(triggerMessage);

    for (const triggerredOrder of triggerredOrders) {
      await this.orderSvc.markAsFilled(triggerredOrder);
    }
    return await this.createOrdersAfterTrigger(triggerredOrders, plan);
  }

  private postDiscordSyncMessage(plan: Plan): void {
    const syncMessage: DiscordMessage = new DiscordMessage();
    syncMessage.type = DiscordMessageType.SYNC;
    syncMessage.params = {};
    syncMessage.params.pair = plan.pair.token1 + '-' + plan.pair.token2;
    syncMessage.params.time = new Date().toLocaleTimeString('fr-FR', { timeZone: Utils.getTimeZone() });
    this.moduleCallerSvc.postMessageWithParamsOnDiscord(syncMessage);
  }

  private async createOrdersAfterTrigger(triggerredOrders: Order[], plan: Plan): Promise<Exchange[]> {
    const steps = plan.stepLevels;
    const ordersDb = await this.orderSvc.findByPlanId(plan._id, { status: OPEN_STATUS });
    const existingStep: number[] = ordersDb.map((order) => order.price.value);
    const stepWithoutOrder: number[] = steps.filter((step) => !existingStep.includes(step));
    const ordersToCreate: Order[] = [];
    this.logger.warn(`stepWithoutOrder: ${JSON.stringify(stepWithoutOrder)}`);
    for (const order of triggerredOrders) {
      let side;
      let step;
      if (order.side === Side.BUY) {
        side = Side.SELL;
        step = stepWithoutOrder[stepWithoutOrder.length - 1];
        stepWithoutOrder.splice(stepWithoutOrder.length - 1, 1);
      } else {
        side = Side.BUY;
        step = stepWithoutOrder[0];
        stepWithoutOrder.splice(0, 1);
      }
      await this.createOrderDb(plan, side, step, ordersToCreate);
    }
    this.logger.warn(`ordersToCreate: ${JSON.stringify(ordersToCreate)}`);
    const postOrderRequest: PostOrderRequest = {
      platform: plan.platform,
      orders: ordersToCreate,
    };
    const exchanges: Exchange[] = await this.moduleCallerSvc.callNetworkModule(
      Method.POST,
      'cex/postOrders',
      postOrderRequest,
    );
    this.moduleCallerSvc.postMessageWithParamsOnDiscord({
      type: DiscordMessageType.CREATE,
      params: { orders: ordersToCreate },
    });
    return exchanges;
  }

  private async createOrderDb(plan: Plan, side: Side, step: number, ordersToCreate: Order[]): Promise<void> {
    const order: Order = new OrderBuilder()
      .withPlanId(plan._id)
      .withSide(side)
      .withPrice({ value: step, type: PriceType.LIMIT })
      .withStatus(OrderStatus.NEW)
      .withAmount(plan.amountPerStep)
      .withPair(plan.pair)
      .build();
    const orderDb: Order = await this.orderSvc.create(order);
    ordersToCreate.push(orderDb);
  }

  private createOrderRequestByPlan(planId: string, plan: any): GetOrdersRequest {
    return {
      planId,
      platform: plan.platform,
      pair: plan.pair,
    };
  }

  private async getPlan(planId: string): Promise<Plan> {
    return await this.moduleCallerSvc.callPlanModule(Method.GET, `plans/${planId}`, null);
  }
}

function getDesyncOrdersSorted(ordersDb: Order[], ordersCex: Order[]): Order[] {
  const desyncOrders: Order[] = [];
  ordersDb.forEach((order: Order) => {
    const orderCex = ordersCex.find((orderCex: Order) => orderCex._id == order._id);
    if (!orderCex) {
      desyncOrders.push(order);
    }
  });
  return desyncOrders.sort((a, b) => a.price.value - b.price.value);
}
