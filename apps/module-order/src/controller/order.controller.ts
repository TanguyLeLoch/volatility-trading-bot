import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { Order } from '@model/order';
import { OrderSvc } from '../service/order.service';
import { Plan } from '@model/plan';

@Controller('orders')
export class OrderController {
  constructor(private orderSvc: OrderSvc) {}

  @Get(':id')
  getOrderById(@Param() { id }: { id: string }): Promise<Order> {
    return this.orderSvc.findById(id);
  }

  @Post('/plan')
  postOrdersWithPlan(@Body() plan: Plan): Promise<Array<Order>> {
    return this.orderSvc.createByPlan(plan);
  }
  @Post('synchronize/:planId')
  synchronize(@Param() { planId }: { planId: string }): Promise<any> {
    return this.orderSvc.synchronize(planId);
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
  deleteOrder(@Param() { id }: { id: string }): Promise<Order> {
    return this.orderSvc.delete(id);
  }
}
