import { Body, Controller, Logger, Post } from '@nestjs/common';
import { CexSvc } from '../service/cex.service';
import { Order } from '@model/order';
import { Price } from '@model/common';
import { Exchange, GetOrderRequest, GetPriceRequest } from '@model/network';

@Controller('cex')
export class CexController {
  private readonly logger = new Logger(CexController.name);
  constructor(private readonly cexSvc: CexSvc) {}

  @Post('orders')
  getOrder(@Body() getRequest: GetOrderRequest): Promise<Order[]> {
    return this.cexSvc.getCexOrder(getRequest);
  }
  @Post('price')
  getPrice(@Body() getRequest: GetPriceRequest): Promise<Price> {
    return this.cexSvc.getPrice(getRequest.pair, getRequest.platform);
  }
  @Post('postOrders')
  postOrders(@Body() orders: Array<Order>): Promise<Exchange[]> {
    return this.cexSvc.postOrders(orders);
  }
}
