import { Injectable, Logger } from '@nestjs/common';
import { Order } from 'module-order-model';
import { Pair } from 'module-core/common';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map, of } from 'rxjs';

@Injectable()
export class ExternalCallerSvc {
  private readonly logger = new Logger(ExternalCallerSvc.name);
  constructor(private httpService: HttpService) {}

  async getDexOrders(pair: Pair, platform: string): Promise<Array<Order>> {
    this.logger.log(`getDexOrders: pair=${pair} platform=${platform}`);
    if (platform === 'MEXC') {
      const mexcBaseUrl = 'https://www.mexc.com/open/api/v2/market/symbols';
      const resp: { data: { code: number; data: Array<any> } } =
        (await lastValueFrom(this.httpService.get(mexcBaseUrl))) as any;
      const data: Array<any> = resp.data.data;
      for (const item of data) {
        if (
          item.symbol.includes(pair.token1) &&
          item.symbol.includes(pair.token2)
        ) {
          this.logger.log(`item: ${JSON.stringify(item)}`);
          break;
        }
      }
    }
    return [];
  }
}
