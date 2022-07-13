import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Pair, Price } from '@model/common';
import { Exchange, GetOrderRequest } from '@model/network';
import { Order } from '@model/order';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { MexcSvc } from './mexc.service';

@Injectable()
export class CexSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, CexSvc.name);
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc, private readonly mexcSvc: MexcSvc) {}

  async getCexOrder(request: GetOrderRequest): Promise<Order[]> {
    this.logger.verbose(`request: ${JSON.stringify(request)}`);
    if (request.platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    this.logger.verbose(`Getting order for ${JSON.stringify(request.pair)}`);
    return this.mexcSvc.getActiveOrders(request.pair);
  }
  async postOrders(orders: Order[]): Promise<Exchange[]> {
    const plan = await this.moduleCallerSvc.callModule('plan', Method.GET, `plans/${orders[0].planId}`, null);
    this.logger.verbose(`plan: ${JSON.stringify(plan)}`);
    if (plan.platform !== 'MEXC') {
      throw new Error('Only mexc is supported');
    }
    return this.mexcSvc.postOrders(orders);
  }
  getPrice(pair: Pair, platform: string): Promise<Price> {
    if (platform !== 'MEXC') {
      throw new Error('Method not implemented.');
    }
    return this.mexcSvc.getPrice(pair);
  }
}
