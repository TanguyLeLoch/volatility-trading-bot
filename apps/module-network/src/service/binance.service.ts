import { createCustomLogger, ExternalCallerSvc } from '@app/core';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { AbstractExchangeSvc } from './abstract.exchange.service';
import { ExchangeSvc } from './exchange.service';
import { Platform } from '@model/common';
import { PairInfoRepository } from '../PairInfo/pair.info.repository';

@Injectable()
export class BinanceSvc extends AbstractExchangeSvc {
  private readonly binanceLogger: winston.Logger = createCustomLogger(moduleName, BinanceSvc.name);
  private static readonly secretKey: string = process.env.BINANCE_SECRET_KEY;
  private static readonly baseUrl: string =
    process.env.ENV === 'prod' ? 'https://api.binance.com' : 'http://localhost:43000';
  private static readonly headers =
    process.env.ENV === 'prod'
      ? { 'X-MBX-APIKEY': process.env.BINANCE_ACCESS_KEY }
      : { 'X-MBX-APIKEY': 'test', platform: 'BINANCE' };

  private static readonly platform: Platform = 'BINANCE';

  constructor(
    private readonly externalCallerSvcBinance: ExternalCallerSvc,
    private readonly exchangeSvcBinance: ExchangeSvc,
    private readonly pairInfoRepositoryBinance: PairInfoRepository,
  ) {
    super(externalCallerSvcBinance, exchangeSvcBinance, pairInfoRepositoryBinance);
  }

  getHeaders(): object {
    return BinanceSvc.headers;
  }

  getPrivateKey(): string {
    return BinanceSvc.secretKey;
  }

  getBaseUrl(): string {
    return BinanceSvc.baseUrl;
  }

  getPlatform(): Platform {
    return BinanceSvc.platform;
  }

  //Overriding the abstract method
  getOtherMandatoryLimitPriceOrderParams(): Map<string, string> {
    const mandatoryParams = new Map<string, string>();
    mandatoryParams.set('timeInForce', 'GTC');
    return mandatoryParams;
  }
}
