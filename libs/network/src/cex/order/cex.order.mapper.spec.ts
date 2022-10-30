import { Pair } from '@model/common';
import { CexOrder } from './cex.order';
import { Order, OrderBuilder, OrderPrice, OrderStatus, PriceType, Side } from '@model/order';
import { cexOrderToOrder } from '@model/network';

describe('cexOrderToOrder', () => {
  it('should map a cexOrder to an Order', () => {
    const pair: Pair = { token1: 'AZERO', token2: 'USDT' };
    const cexOrder: CexOrder = {
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
      updateTime: 1661720208750,
    };

    const result: Order = cexOrderToOrder(cexOrder, pair);
    const resultExpected: Order = new OrderBuilder()
      .withAmount(100)
      .withId('630bd6902ccbe95d601a3d50')
      .withPair(pair)
      .withPrice({ type: PriceType.LIMIT, value: 1 } as OrderPrice)
      .withSide(Side.BUY)
      .withStatus(OrderStatus.NEW)
      .withUpdatedAt('2022-08-28T20:56:48.750Z')
      .build();

    expect(result).toEqual(resultExpected);
  });
});
