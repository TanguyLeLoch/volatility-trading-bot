import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Utils } from '@model/common';
import { DiscordMessage, DiscordMessageType } from '@model/discord';
import { Exchange, GetMatchingOrderRequest, GetOrdersRequest, PostOrderRequest } from '@model/network';
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
    const desyncOrders: Order[] = getDesyncOrders(ordersDb, ordersCex);
    if (desyncOrders.length === 0) {
      this.logger.info(`DB and cex orders are synced`);
      this.postDiscordSyncMessage(plan);
      return [];
    }
    this.logger.warn(`${desyncOrders.length} orders are not on cex, they has been triggered`);
    const triggerMessage: DiscordMessage = { type: DiscordMessageType.TRIGGER, params: { orders: desyncOrders } };
    this.moduleCallerSvc.postMessageWithParamsOnDiscord(triggerMessage);

    const desyncCexOrders: Order[] = [];
    for (const desyncOrder of desyncOrders) {
      const request: GetMatchingOrderRequest = this.createGetMatchingOrderRequest(desyncOrder, plan);
      const orderCex: Order = await this.moduleCallerSvc.callNetworkModule(Method.POST, 'cex/order', request);
      desyncCexOrders.push(orderCex);
    }

    desyncCexOrders.sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

    const lastUpdatedCexOrder: Order = desyncCexOrders[desyncCexOrders.length - 1];

    for (const desyncOrder of desyncOrders) {
      await this.orderSvc.markAsFilled(desyncOrder);
    }

    return await this.createOrdersAfterTrigger(lastUpdatedCexOrder, plan);
  }

  private postDiscordSyncMessage(plan: Plan): void {
    const syncMessage: DiscordMessage = new DiscordMessage();
    syncMessage.type = DiscordMessageType.SYNC;
    syncMessage.params = {};
    syncMessage.params.pair = plan.pair.token1 + '-' + plan.pair.token2;
    syncMessage.params.time = new Date().toLocaleTimeString('fr-FR', { timeZone: Utils.getTimeZone() });
    this.moduleCallerSvc.postMessageWithParamsOnDiscord(syncMessage);
  }

  private async createOrdersAfterTrigger(lastUpdatedCexOrder: Order, plan: Plan): Promise<Exchange[]> {
    const steps = plan.stepLevels;
    const ordersDb = await this.orderSvc.findByPlanId(plan._id, { status: OPEN_STATUS });
    const side: Side = lastUpdatedCexOrder.side;
    const existingStep: number[] = ordersDb.map((order) => order.price.value);
    const stepToCreate: number[] = steps.filter(
      (step) => !existingStep.includes(step) && step !== lastUpdatedCexOrder.price.value,
    );
    const ordersToCreate: Order[] = [];
    for (const step of stepToCreate) {
      const order: Order = new OrderBuilder()
        .withPlanId(plan._id)
        .withSide(side === Side.BUY ? Side.SELL : Side.BUY)
        .withPrice({ value: step, type: PriceType.LIMIT })
        .withStatus(OrderStatus.NEW)
        .withAmount(plan.amountPerStep)
        .withPair(plan.pair)
        .build();
      const orderDb: Order = await this.orderSvc.create(order);
      ordersToCreate.push(orderDb);
    }
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

  private createOrderRequestByPlan(planId: string, plan: any): GetOrdersRequest {
    return {
      planId,
      platform: plan.platform,
      pair: plan.pair,
    };
  }

  private createGetMatchingOrderRequest(order: Order, plan: Plan): GetMatchingOrderRequest {
    return {
      platform: plan.platform,
      order,
    };
  }

  private async getPlan(planId: string): Promise<Plan> {
    return await this.moduleCallerSvc.callPlanModule(Method.GET, `plans/${planId}`, null);
  }
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
