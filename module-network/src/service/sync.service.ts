import { Injectable } from '@nestjs/common';
import { Order } from 'module-order-model';
import { Method } from 'module-core';
import { callModule } from 'module-core';
import { ExternalCallerSvc } from './external.caller.service';
import { Pair } from 'module-core/common';

@Injectable()
export class SyncSvc {
  constructor(private externalCallerSvc: ExternalCallerSvc) {}

  async syncOrder(pair: Pair, platform: string): Promise<Order> {
    const orderFromDb = await callModule('order', Method.GET, 'orders', null);
    const ordersFromDex = await this.externalCallerSvc.getDexOrders(
      pair,
      platform,
    );

    return orderFromDb;
  }
}
