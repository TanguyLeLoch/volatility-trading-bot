import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { Order } from 'module-order-model';
import { OrderSvc } from '../service/order.service';

@Controller('orders')
export class OrderController {
  constructor(private orderSvc: OrderSvc) {}

  @Get(':id')
  getOrderById(@Param() { id }): Promise<Order> {
    return this.orderSvc.findById(id);
  }

  @Get()
  getOrders(): Promise<Array<Order>> {
    return this.orderSvc.findAll();
  }

  @Put()
  putOrder(@Body() order: Order): Promise<Order> {
    return this.orderSvc.modify(order);
  }

  @Post()
  postOrder(@Body() order: Order): Promise<Order> {
    return this.orderSvc.create(order);
  }

  @Delete(':id')
  deleteOrder(@Param() { id }): Promise<Order> {
    return this.orderSvc.delete(id);
  }
}
