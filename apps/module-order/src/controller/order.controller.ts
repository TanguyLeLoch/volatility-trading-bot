import { createCustomLogger } from '@app/core';
import { GridRequest } from '@model/common';
import { Exchange } from '@model/network';
import { Order } from '@model/order';
import { Plan } from '@model/plan';
import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { OrderSvc } from '../service/order.service';
import { SyncOrderSvc } from '../service/sync.order.service';

@Controller()
export class OrderController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, OrderController.name);

  constructor(private readonly orderSvc: OrderSvc, private readonly syncOrderSvc: SyncOrderSvc) {}

  @Get('orders/:id')
  getOrderById(@Param() { id }: { id: string }): Promise<Order> {
    return this.orderSvc.findById(id);
  }

  @Post('orders/plan')
  postOrdersWithPlan(@Body() plan: Plan): Promise<Array<Order>> {
    return this.orderSvc.createByPlan(plan);
  }

  @Post('orders/synchronize/:planId')
  synchronize(@Param() { planId }: { planId: string }): Promise<Exchange[]> {
    this.logger.info(`synchronize with for plan id ${planId}`);
    return this.syncOrderSvc.synchronize(planId);
  }

  @Get('orders')
  getOrders(@Query('filters') filters?: string): Promise<Array<Order>> {
    const filtersObj = filters ? JSON.parse(filters) : {};
    return this.orderSvc.findAllMatchingFilters(filtersObj);
  }

  @Put('orders')
  putOrder(@Body() order: Order): Promise<Order> {
    return this.orderSvc.modify(order);
  }

  @Post('orders')
  postOrder(@Body() order: Order): Promise<Order> {
    return this.orderSvc.create(order);
  }

  @Delete('orders/all')
  deleteAllOrders(): Promise<void> {
    return this.orderSvc.deleteAll();
  }

  @Delete('orders/:id')
  deleteOrder(@Param() { id }: { id: string }): Promise<Order> {
    return this.orderSvc.delete(id);
  }

  @Post('request')
  request(@Body() request: GridRequest): Promise<any> {
    return this.orderSvc.processRequest(request);
  }
}
