import { Injectable, Logger } from '@nestjs/common';
import { Order } from '@model/order';
import { Method } from '@app/core';
import { ModuleCallerSvc, ExternalCallerSvc } from '@app/core';
import { Pair, Price } from '@model/common';
import { MexcSvc } from './mexc.service';
import { Exchange, GetOrderRequest } from '@model/network';

@Injectable()
export class CexSvc {
  private readonly logger = new Logger(CexSvc.name);
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc, private readonly mexcSvc: MexcSvc) {}

  async getCexOrder(request: GetOrderRequest): Promise<Order[]> {
    this.logger.log(`request: ${JSON.stringify(request)}`);
    if (request.platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    this.logger.log(`Getting order for ${JSON.stringify(request.pair)}`);
    return this.mexcSvc.getActiveOrders(request.pair);
  }
  async postOrders(orders: Order[]): Promise<Exchange[]> {
    const plan = await this.moduleCallerSvc.callModule('plan', Method.GET, `plans/${orders[0].planId}`, null);
    this.logger.log(`plan: ${JSON.stringify(plan)}`);
    if (plan.platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    return this.mexcSvc.postOrders(orders);
  }
  getPrice(pair: Pair, platform: string): Promise<Price> {
    if (platform !== 'MEXC') {
      throw new Error('Method not implemented.');
    }
    return this.mexcSvc.getPrice(pair);
  }
}
