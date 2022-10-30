import { Pair } from '@model/common';
import { CexOrder } from './cex.order';
import { Order, OrderPrice } from '@model/order/order';

export function cexOrderToOrder(cexOrder: CexOrder, pair: Pair): Order {
  const order = new Order();
  order._id = cexOrder.clientOrderId ? cexOrder.clientOrderId : cexOrder.orderId;
  order.pair = pair;
  order.side = cexOrder.side;
  order.amount = Number(cexOrder.origQty);
  order.price = {} as OrderPrice;
  order.price.type = cexOrder.type;
  order.price.value = Number(cexOrder.price);
  order.status = cexOrder.status;
  order.updatedAt = new Date(cexOrder.updateTime).toISOString();
  return order;
}
