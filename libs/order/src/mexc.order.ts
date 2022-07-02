import { OrderStatus, PriceType, Side } from './order';

export type MexcOrder = {
  symbol: string;
  orderId: string;
  orderListId: number;
  clientOrderId: string;
  price: string;
  origQty: string;
  executedQty: string;
  cummulativeQuoteQty: string;
  status: OrderStatus;
  timeInForce?: any;
  type: PriceType;
  side: Side;
  stopPrice?: any;
  icebergQty?: any;
  time: number;
  updateTime?: number;
  isWorking: boolean;
  origQuoteOrderQty: string;
};
