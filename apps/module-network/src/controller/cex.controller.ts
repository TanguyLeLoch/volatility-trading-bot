import { createCustomLogger } from '@app/core';
import { Balance } from '@model/balance';
import { Price } from '@model/common';
import {
  Exchange,
  GetBalancesRequest,
  GetMatchingOrderRequest,
  GetOrdersRequest,
  GetPriceRequest,
  PostOrderRequest,
} from '@model/network';
import { Order } from '@model/order';
import { Body, Controller, Post } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { CexSvc } from '../service/cex.service';

@Controller('cex')
export class CexController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, CexController.name);

  constructor(private readonly cexSvc: CexSvc) {}

  @Post('orders')
  getOrders(@Body() request: GetOrdersRequest): Promise<Order[]> {
    return this.cexSvc.getCexOpenOrder(request);
  }

  @Post('order')
  getOrder(@Body() request: GetMatchingOrderRequest): Promise<Order> {
    return this.cexSvc.getCexOrder(request);
  }

  @Post('balances')
  getBalance(@Body() request: GetBalancesRequest): Promise<Balance[]> {
    return this.cexSvc.getCexBalance(request);
  }

  @Post('price')
  getPrice(@Body() request: GetPriceRequest): Promise<Price> {
    return this.cexSvc.getPrice(request);
  }

  @Post('postOrders')
  postOrders(@Body() request: PostOrderRequest): Promise<Exchange[]> {
    return this.cexSvc.postOrders(request);
  }
}
