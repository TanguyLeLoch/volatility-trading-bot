import { Injectable, Logger } from '@nestjs/common';
import { Order } from '@model/order';
import { Method } from '@app/core';
import { ModuleCallerSvc, ExternalCallerSvc } from '@app/core';
import { Pair } from '@model/common';

@Injectable()
export class SyncSvc {
  private readonly logger = new Logger(SyncSvc.name);
  constructor(
    private readonly externalCallerSvc: ExternalCallerSvc,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async syncOrder(pair: Pair, platform: string): Promise<Order> {
    this.logger.log(`pair: ${JSON.stringify(pair)}`);
    const orderFromDb = await this.moduleCallerSvc.callModule(
      'order',
      Method.GET,
      'orders',
      null,
    );
    const mexcBaseUrl = 'https://www.mexc.com/open/api/v2/market/symbols';
    const { data } = await this.externalCallerSvc.callExternal(
      Method.GET,
      mexcBaseUrl,
      null,
    );
    this.logger.log(`pair: ${JSON.stringify(pair)}`);
    for (const item of data) {
      if (
        item.symbol.includes(pair.token1) &&
        item.symbol.includes(pair.token2)
      ) {
        this.logger.log(`item: ${JSON.stringify(item)}`);
        break;
      }
    }
    return orderFromDb;
  }
}
