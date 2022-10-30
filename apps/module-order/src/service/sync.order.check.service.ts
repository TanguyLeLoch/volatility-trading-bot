import { createCustomLogger, FunctionalException } from '@app/core';
import { Order, OrderStatus } from '@model/order';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';

const OPEN_ORDER_STATUS = [OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED];

@Injectable()
export class SyncOrderCheckSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, SyncOrderCheckSvc.name);

  checkOrders(ordersCex: Order[], ordersDb: Order[]): void {
    this.checkStatus(ordersCex);
    this.checkNotEmpty(ordersCex);
    this.checkCoherentNumber(ordersCex, ordersDb);
    this.checkCexOrderExistsInDb(ordersCex, ordersDb);
  }

  checkStatus(ordersCex: Order[]): void {
    ordersCex.forEach((order: Order) => {
      if (!OPEN_ORDER_STATUS.includes(order.status)) {
        this.logger.error(`Order ${order._id} is not open`);
        throw new FunctionalException(`Order ${order._id} is not open`, `ORDER_NOT_OPEN_ON_CEX`);
      }
    });
  }

  checkNotEmpty(ordersCex: Order[]): void {
    if (ordersCex.length === 0) {
      throw new FunctionalException('No order on CEX', `NO_ORDERS_ON_CEX`);
    }
  }

  checkCoherentNumber(ordersCex: Order[], ordersDb: Order[]): void {
    this.logger.info(`Found ${ordersCex.length} orders on cex`);
    if (ordersDb.length < ordersCex.length) {
      throw new FunctionalException('There is more order on CEX', `MORE_ORDER_ON_CEX`);
    }
    if (ordersCex.length <= Math.floor(ordersDb.length * 0.75)) {
      this.logger.error(
        `${ordersCex.length} orders on CEX and ${ordersDb.length} orders in DB : too many CEX order triggered`,
      );
      throw new FunctionalException(
        `${ordersCex.length} orders on CEX and ${ordersDb.length} orders in DB : too many CEX order triggered`,
        `TOO_MANY_ORDER_TRIGGERED`,
      );
    }
  }

  checkCexOrderExistsInDb(ordersCex: Order[], ordersDb: Order[]): void {
    ordersCex.forEach((order: Order) => {
      const orderDb = ordersDb.find((orderDb: Order) => orderDb._id == order._id);
      if (!orderDb) {
        this.logger.error(`Order ${order._id} is not in database`);
        throw new FunctionalException(`Order ${order._id} is not in database`, `UNKNOWN_ORDER_ON_CEX`);
      }
    });
  }
}
