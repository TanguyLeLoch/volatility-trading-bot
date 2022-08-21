import { createCustomLogger } from '@app/core';
import { Balance } from '@model/balance';
import { Price } from '@model/common';
import { Exchange, GetBalancesRequest, GetOrderRequest, GetPriceRequest, PostOrderRequest } from '@model/network';
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
  getOrder(@Body() getRequest: GetOrderRequest): Promise<Order[]> {
    return this.cexSvc.getCexOrder(getRequest);
  }
  @Post('balances')
  getBalance(@Body() request: GetBalancesRequest): Promise<Balance> {
    return this.cexSvc.getCexBalance(request);
  }
  @Post('price')
  getPrice(@Body() getRequest: GetPriceRequest): Promise<Price> {
    return this.cexSvc.getPrice(getRequest);
  }
  @Post('postOrders')
  postOrders(@Body() postRequest: PostOrderRequest): Promise<Exchange[]> {
    return this.cexSvc.postOrders(postRequest);
  }
}
