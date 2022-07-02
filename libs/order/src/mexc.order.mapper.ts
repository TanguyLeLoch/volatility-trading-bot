import { Pair } from '@model/common';
import { MexcOrder } from './mexc.order';
import { Order, OrderPrice } from './order';

export function mexcOrderToOrder(mexcOrder: MexcOrder, pair: Pair): Order {
  const order = new Order();
  order._id = mexcOrder.clientOrderId
    ? mexcOrder.clientOrderId
    : mexcOrder.orderId;
  order.pair = pair;
  order.side = mexcOrder.side;
  order.amount = Number(mexcOrder.origQty);
  order.price = {} as OrderPrice;
  order.price.type = mexcOrder.type;
  order.price.value = Number(mexcOrder.price);
  order.status = mexcOrder.status;
  return order;
}
