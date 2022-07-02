import { Pair } from '@model/common';
import { OrderStatus } from '@model/order';

export type GetOrderRequest = {
  platform: string;
  planId: string;
  pair: Pair;
  status?: OrderStatus; // optional
};

export type GetPriceRequest = {
  platform: string;
  pair: Pair;
};
