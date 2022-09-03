import { Pair } from '@model/common';
import { MexcOrder } from './mexc.order';
import { mexcOrderToOrder } from './mexc.order.mapper';
import { Order, OrderBuilder, OrderPrice, OrderStatus, PriceType, Side } from './order';

describe('mexcOrderToOrder', () => {
  it('should map a mexcOrder to an Order', () => {
    const pair: Pair = { token1: 'AZERO', token2: 'USDT' };
    const mexcOrder: MexcOrder = {
      symbol: 'AZEROUSDT',
      clientOrderId: '630bd6902ccbe95d601a3d50',
      price: '1',
      origQty: '100',
      status: OrderStatus.NEW,
      type: PriceType.LIMIT,
      side: Side.BUY,
      time: 1661720208750,
      orderId: null,
      orderListId: null,
      executedQty: null,
      isWorking: null,
      origQuoteOrderQty: null,
      cummulativeQuoteQty: null,
    };

    const result: Order = mexcOrderToOrder(mexcOrder, pair);
    const resultExpected: Order = new OrderBuilder()
      .withAmount(100)
      .withId('630bd6902ccbe95d601a3d50')
      .withPair(pair)
      .withPrice({ type: PriceType.LIMIT, value: 1 } as OrderPrice)
      .withSide(Side.BUY)
      .withStatus(OrderStatus.NEW)
      .build();
    expect(result).toEqual(resultExpected);
  });
});
