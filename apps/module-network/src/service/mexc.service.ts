import { createCustomLogger, ExternalCallerSvc } from '@app/core';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { AbstractExchangeSvc } from './abstract.exchange.service';
import { ExchangeSvc } from './exchange.service';
import { Platform } from '@model/common';
import { PairInfoRepository } from '../PairInfo/pair.info.repository';

@Injectable()
export class MexcSvc extends AbstractExchangeSvc {
  private readonly mexcSvcLogger: winston.Logger = createCustomLogger(moduleName, MexcSvc.name);
  private static readonly baseUrl: string =
    process.env.ENV === 'prod' ? 'https://api.mexc.com' : 'http://localhost:43000';
  private static readonly secretKey: string = process.env.MEXC_SECRET_KEY;
  private static readonly headers =
    process.env.ENV === 'prod'
      ? { 'X-MEXC-APIKEY': process.env.MEXC_ACCESS_KEY }
      : { 'X-MBX-APIKEY': 'test', platform: 'MEXC' };
  private static readonly platform: Platform = 'MEXC';

  constructor(
    private readonly externalCallerSvcMexc: ExternalCallerSvc,
    private readonly exchangeSvcMexc: ExchangeSvc,
    private readonly pairInfoRepositoryMexc: PairInfoRepository,
  ) {
    super(externalCallerSvcMexc, exchangeSvcMexc, pairInfoRepositoryMexc);
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

  getPlatform(): Platform {
    return MexcSvc.platform;
  }
}
