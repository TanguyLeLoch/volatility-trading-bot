import { Pair } from '@model/common';
import { Order, OrderStatus, PriceType, Side } from '@model/order';

export const orderToCreate: Array<Order> = [
  {
    planId: 'id123',
    pair: new Pair({ token1: 'BTC', token2: 'USDT' }),
    status: OrderStatus.FILLED,
    price: {
      type: PriceType.MARKET,
    },
    side: Side.BUY,
    amount: 600,
  },
  {
    planId: 'id123',
    pair: new Pair({ token1: 'BTC', token2: 'USDT' }),

    status: OrderStatus.NEW,
    price: {
      type: PriceType.LIMIT,
      value: 16000,
    },
    amount: 200,
    side: Side.BUY,
  },
  {
    planId: 'id123',
    pair: new Pair({ token1: 'BTC', token2: 'USDT' }),
    status: OrderStatus.NEW,
    price: {
      type: PriceType.LIMIT,
      value: 17600,
    },
    amount: 200,
    side: Side.BUY,
  },
  {
    planId: 'id123',
    pair: new Pair({ token1: 'BTC', token2: 'USDT' }),
    status: OrderStatus.NEW,
    price: {
      type: PriceType.LIMIT,
      value: 21296,
    },
    amount: 200,
    side: Side.SELL,
  },
  {
    planId: 'id123',
    pair: new Pair({ token1: 'BTC', token2: 'USDT' }),
    status: OrderStatus.NEW,
    price: {
      type: PriceType.LIMIT,
      value: 23425.6,
    },
    amount: 200,
    side: Side.SELL,
  },
  {
    planId: 'id123',
    pair: new Pair({ token1: 'BTC', token2: 'USDT' }),
    status: OrderStatus.NEW,
    price: {
      type: PriceType.LIMIT,
      value: 25768.16,
    },
    amount: 200,
    side: Side.SELL,
  },
];
