import { Balance } from '@model/balance';
import { Pair, Price } from '@model/common';
import { Exchange } from '@model/network';
import { Order } from '@model/order';

export abstract class AbstractExchangeSvc {
  abstract getActiveOrders(pair: Pair): Promise<Array<Order>>;
  abstract getPrice(pair: Pair): Promise<Price>;
  abstract postOrders(orders: Order[]): Promise<Exchange[]>;
  abstract getBalances(): Promise<Balance[]>;
  static baseUrl: string;
}
