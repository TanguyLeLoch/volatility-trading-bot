import { createCustomLogger, FunctionalException } from '@app/core';
import { Order, OrderStatus } from '@model/order';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';

const OPEN_ORDER_STATUS = [OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED];

@Injectable()
export class SyncOrderCheckSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, SyncOrderCheckSvc.name);

  checkOrders(ordersCex: any, ordersDb: Order[]): void {
    this.checkStatus(ordersCex);
    this.checkNotEmpty(ordersCex);
    this.checkCoherentNumber(ordersCex, ordersDb);
    this.checkCexOrderExistsInDb(ordersCex, ordersDb);
  }

  checkStatus(ordersCex: Order[]) {
    ordersCex.forEach((order: Order) => {
      if (!OPEN_ORDER_STATUS.includes(order.status)) {
        this.logger.error(`Order ${order._id} is not open`);
        throw new FunctionalException(`Order ${order._id} is not open`, `ORDER_NOT_OPEN_ON_CEX`);
      }
    });
  }
  checkNotEmpty(ordersCex: Order[]) {
    if (ordersCex.length === 0) {
      throw new Error(`NO_ORDERS_ON_CEX`);
    }
  }
  checkCoherentNumber(ordersCex: Order[], ordersDb: Order[]) {
    this.logger.info(`Found ${ordersCex.length} orders on cex`);
    if (ordersDb.length < ordersCex.length) {
      throw new Error(`MORE_ORDER_ON_CEX`);
    }
  }
  checkCexOrderExistsInDb(ordersCex: Order[], ordersDb: Order[]) {
    ordersCex.forEach((order: Order) => {
      const orderDb = ordersDb.find((orderDb: Order) => orderDb._id == order._id);
      if (!orderDb) {
        this.logger.error(`Order ${order._id} is not in database`);
        throw new FunctionalException(`Order ${order._id} is not in database`, `UNKNOWN_ORDER_ON_CEX`);
      }
    });
  }
}
