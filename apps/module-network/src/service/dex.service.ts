import { Injectable, Logger } from '@nestjs/common';
import { Order } from '@model/order';
import { Method } from '@app/core';
import { ModuleCallerSvc, ExternalCallerSvc } from '@app/core';
import { Pair, Price } from '@model/common';
import { MexcSvc } from './mexc.service';
import { Exchange } from '@model/network';

@Injectable()
export class DexSvc {
  getPrice(pair: Pair, platform: string): Promise<Price> {
    if (platform !== 'MEXC') {
      throw new Error('Method not implemented.');
    }
    return this.mexcSvc.getPrice(pair);
  }
  private readonly logger = new Logger(DexSvc.name);
  constructor(
    private readonly externalCallerSvc: ExternalCallerSvc,
    private readonly moduleCallerSvc: ModuleCallerSvc,
    private readonly mexcSvc: MexcSvc,
  ) {}

  async dexOrder(pair: Pair, platform: string): Promise<Order> {
    this.logger.log(`pair: ${JSON.stringify(pair)}`);
    if (platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    return this.mexcSvc.getActiveOrders(pair);
  }
  async postOrders(orders: Order[]): Promise<Exchange[]> {
    const plan = await this.moduleCallerSvc.callModule(
      'plan',
      Method.GET,
      `plans/${orders[0].planId}`,
      null,
    );
    if (plan.platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    return this.mexcSvc.postOrders(orders);
  }
}
