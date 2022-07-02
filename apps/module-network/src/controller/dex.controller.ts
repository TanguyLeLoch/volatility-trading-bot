import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DexSvc } from '../service/dex.service';
import { Order } from '@model/order';
import { Price } from '@model/common';
import { Exchange, GetOrderRequest, GetPriceRequest } from '@model/network';

@Controller('dex')
export class DexController {
  private readonly logger = new Logger(DexController.name);
  constructor(private readonly dexSvc: DexSvc) {}

  @Post('orders')
  getOrder(@Body() getRequest: GetOrderRequest): Promise<Order[]> {
    return this.dexSvc.getDexOrder(getRequest);
  }
  @Post('price')
  getPrice(@Body() getRequest: GetPriceRequest): Promise<Price> {
    return this.dexSvc.getPrice(getRequest.pair, getRequest.platform);
  }
  @Post('postOrders')
  postOrders(@Body() orders: Array<Order>): Promise<Exchange[]> {
    return this.dexSvc.postOrders(orders);
  }
}
