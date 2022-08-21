import { createCustomLogger, ModuleCallerSvc } from '@app/core';
import { Balance } from '@model/balance';
import { Price } from '@model/common';
import {
  CexRequest,
  Exchange,
  GetBalancesRequest,
  GetOrderRequest,
  GetPriceRequest,
  PostOrderRequest,
} from '@model/network';
import { Order } from '@model/order';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { AbstractExchangeSvc } from './AbstractExchangeSvc';
import { MexcSvc } from './mexc.service';

@Injectable()
export class CexSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, CexSvc.name);
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc, private readonly mexcSvc: MexcSvc) {}

  getCexService(request: CexRequest): AbstractExchangeSvc {
    if (request.platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    return this.mexcSvc;
  }

  async getCexOrder(request: GetOrderRequest): Promise<Order[]> {
    this.logger.verbose(`request: ${JSON.stringify(request)}`);

    this.logger.verbose(`Getting order for ${JSON.stringify(request.pair)}`);
    return this.getCexService(request).getActiveOrders(request.pair);
  }
  async postOrders(request: PostOrderRequest): Promise<Exchange[]> {
    return this.getCexService(request).postOrders(request.orders);
  }
  async getPrice(request: GetPriceRequest): Promise<Price> {
    return await this.getCexService(request).getPrice(request.pair);
  }

  async getCexBalance(request: GetBalancesRequest): Promise<Balance[]> {
    return await this.getCexService(request).getBalances();
  }
}
