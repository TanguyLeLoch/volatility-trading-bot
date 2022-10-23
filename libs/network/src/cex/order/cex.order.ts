import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { OrderStatus, PriceType, Side } from '@model/order';

@Schema()
export class CexOrder {
  public _id?: string;
  public __v?: string;
  @Prop()
  symbol: string;
  @Prop()
  orderId: string;
  @Prop()
  orderListId: number;
  @Prop()
  clientOrderId: string;
  @Prop()
  price: string;
  @Prop()
  origQty: string;
  @Prop()
  executedQty: string;
  @Prop()
  cummulativeQuoteQty: string;
  @Prop({ type: String, enum: OrderStatus })
  status: OrderStatus;
  @Prop({ type: Number })
  timeInForce?: number;
  @Prop({ type: String, enum: PriceType })
  type: PriceType;
  @Prop({ type: String, enum: Side })
  side: Side;
  @Prop({ type: Number, enum: Side })
  stopPrice?: number;
  @Prop({ type: Number })
  icebergQty?: number;
  @Prop()
  time: number;
  @Prop()
  updateTime?: number;
  @Prop()
  isWorking: boolean;
  @Prop()
  origQuoteOrderQty: string;
}

export const CexOrderSchema = SchemaFactory.createForClass(CexOrder);
