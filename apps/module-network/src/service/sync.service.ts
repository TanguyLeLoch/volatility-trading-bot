import { Injectable, Logger } from '@nestjs/common';
import { Order } from '@model/order';
import { Method } from '@app/core';
import { ModuleCallerSvc, ExternalCallerSvc } from '@app/core';
import { Pair } from '@model/common';
import { MexcSvc } from './mexc.service';

@Injectable()
export class SyncSvc {
  private readonly logger = new Logger(SyncSvc.name);
  constructor(
    private readonly externalCallerSvc: ExternalCallerSvc,
    private readonly moduleCallerSvc: ModuleCallerSvc,
    private readonly mexcSvc: MexcSvc,
  ) {}

  async syncOrder(pair: Pair, platform: string): Promise<Order> {
    this.logger.log(`pair: ${JSON.stringify(pair)}`);

    const res = await this.mexcSvc.getActiveOrders(pair);

    // const orderFromDb = await this.moduleCallerSvc.callModule(
    //   'order',
    //   Method.GET,
    //   'orders',
    //   null,
    // );

    return null;
  }
}
