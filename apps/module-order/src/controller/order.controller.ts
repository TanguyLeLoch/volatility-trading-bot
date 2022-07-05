import { Controller, Get, Post, Put, Body, Param, Delete } from '@nestjs/common';
import { Order } from '@model/order';
import { OrderSvc } from '../service/order.service';
import { Plan } from '@model/plan';
import { SyncOrderSvc } from '../service/sync.order.service';
import { Exchange } from '@model/network';
import winston from 'winston';
import { createCustomLogger } from '@app/core';
import { moduleName } from '../main';

@Controller('orders')
export class OrderController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, OrderController.name);
  constructor(private readonly orderSvc: OrderSvc, private readonly syncOrderSvc: SyncOrderSvc) {}

  @Get(':id')
  getOrderById(@Param() { id }: { id: string }): Promise<Order> {
    return this.orderSvc.findById(id);
  }

  @Post('/plan')
  postOrdersWithPlan(@Body() plan: Plan): Promise<Array<Order>> {
    return this.orderSvc.createByPlan(plan);
  }
  @Post('synchronize/:planId')
  synchronize(@Param() { planId }: { planId: string }): Promise<Exchange[]> {
    this.logger.info(`synchronize with for plan id ${planId}`);
    return this.syncOrderSvc.synchronize(planId);
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
  @Delete('all')
  deleteAllOrders(): Promise<void> {
    return this.orderSvc.deleteAll();
  }

  @Delete(':id')
  deleteOrder(@Param() { id }: { id: string }): Promise<Order> {
    return this.orderSvc.delete(id);
  }
}
