import { createCustomLogger, ExternalCallerSvc } from '@app/core';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { AbstractExchangeSvc } from './abstract.exchange.service';
import { ExchangeSvc } from './exchange.service';

@Injectable()
export class MexcSvc extends AbstractExchangeSvc {
  private readonly mexcSvcLogger: winston.Logger = createCustomLogger(moduleName, MexcSvc.name);
  private static readonly baseUrl: string =
    process.env.ENV === 'prod' ? 'https://api.mexc.com' : 'http://localhost:43000';
  private static readonly secretKey: string = process.env.MEXC_SECRET_KEY;
  private static readonly headers =
    process.env.ENV === 'prod'
      ? { 'X-MEXC-APIKEY': process.env.MEXC_ACCESS_KEY }
      : {
          'X-MBX-APIKEY': 'test',
          platform: 'MEXC',
        };
  private static readonly platform: string = 'BINANCE';

  constructor(
    private readonly externalCallerSvcBinance: ExternalCallerSvc,
    private readonly exchangeSvcBinance: ExchangeSvc,
  ) {
    super(externalCallerSvcBinance, exchangeSvcBinance);
  }

  getHeaders(): object {
    return MexcSvc.headers;
  }

  getPrivateKey(): string {
    return MexcSvc.secretKey;
  }

  getBaseUrl(): string {
    return MexcSvc.baseUrl;
  }

  getPlatform(): string {
    return MexcSvc.platform;
  }
}
