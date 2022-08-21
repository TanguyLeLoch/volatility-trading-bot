import { Pair } from '@model/common';
import { Order, OrderStatus } from '@model/order';

export type CexRequest = {
  platform: string;
};
export interface GetOrderRequest extends CexRequest {
  planId: string;
  pair: Pair;
  status?: OrderStatus; // optional
}
export interface PostOrderRequest extends CexRequest {
  orders: Array<Order>;
}

export interface GetPriceRequest extends CexRequest {
  pair: Pair;
}
export interface GetBalancesRequest extends CexRequest {
  pair: Pair;
}
