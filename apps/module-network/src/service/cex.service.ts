import { createCustomLogger, ModuleCallerSvc } from '@app/core';
import { Balance } from '@model/balance';
import { Price } from '@model/common';
import {
  CexRequest,
  Exchange,
  GetBalancesRequest,
  GetMatchingOrderRequest,
  GetOrdersRequest,
  GetPriceRequest,
  PostOrderRequest,
} from '@model/network';
import { Order } from '@model/order';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { AbstractExchangeSvc } from './abstract.exchange.service';
import { MexcSvc } from './mexc.service';
import { BinanceSvc } from './binance.service';

@Injectable()
export class CexSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, CexSvc.name);

  constructor(
    private readonly moduleCallerSvc: ModuleCallerSvc,
    private readonly mexcSvc: MexcSvc,
    private readonly binanceSvc: BinanceSvc,
  ) {}

  getCexService(request: CexRequest): AbstractExchangeSvc {
    switch (request.platform) {
      case 'MEXC':
        return this.mexcSvc;
      case 'BINANCE':
        return this.binanceSvc;
      default:
        throw new Error(`Unsupported platform: ${request.platform}`);
    }
  }

  async getCexOpenOrder(request: GetOrdersRequest): Promise<Order[]> {
    this.logger.verbose(`Getting order for ${JSON.stringify(request.pair)}`);
    return this.getCexService(request).getActiveOrders(request.pair);
  }

  async getCexOrder(request: GetMatchingOrderRequest): Promise<Order> {
    this.logger.verbose(`Getting order with id : ${JSON.stringify(request.order._id)}`);
    return this.getCexService(request).getOrderById(request.order);
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
