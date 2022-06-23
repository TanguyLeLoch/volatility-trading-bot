import { Body, Controller, Logger, Post } from '@nestjs/common';
import { DexSvc } from '../service/dex.service';
import { Order } from '@model/order';
import { Pair, Price } from '@model/common';
import { Exchange } from '@model/network';

@Controller('dex')
export class DexController {
  private readonly logger = new Logger(DexController.name);
  constructor(private readonly dexSvc: DexSvc) {}

  @Post('order')
  getOrder(@Body() getRequest: GetRequest): Promise<Order> {
    return this.dexSvc.dexOrder(getRequest.pair, getRequest.platform);
  }
  @Post('price')
  getPrice(@Body() getRequest: GetRequest): Promise<Price> {
    return this.dexSvc.getPrice(getRequest.pair, getRequest.platform);
  }
  @Post('postOrders')
  postOrders(@Body() orders: Array<Order>): Promise<Exchange[]> {
    return this.dexSvc.postOrders(orders);
  }
}
type GetRequest = {
  pair: Pair;
  platform: string;
};
