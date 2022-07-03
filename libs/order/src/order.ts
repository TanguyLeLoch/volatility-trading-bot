import { Pair } from '@model/common';
import { Prop, Schema as NestShema, SchemaFactory } from '@nestjs/mongoose';
// import { Schema } from 'mongoose';

// const orderSchema = new Schema({ timestamps: true });
@NestShema({ timestamps: true })
export class Order {
  public _id?: string;
  public __v?: string;
  @Prop({ required: true })
  public planId: string;
  @Prop({ type: Pair, required: true })
  public pair: Pair;
  @Prop({ required: true })
  public amount: number;
  @Prop({ type: String, required: true })
  public status: OrderStatus;
  @Prop({ type: Object, required: true })
  public price: OrderPrice;
  @Prop({ required: true })
  public side: Side;
}
export const OrderSchema = SchemaFactory.createForClass(Order);

export type OrderPrice = {
  type: PriceType;
  value?: number;
};
export enum PriceType {
  LIMIT = 'LIMIT',
  MARKET = 'MARKET',
}
export enum Side {
  BUY = 'BUY',
  SELL = 'SELL',
}

export enum OrderStatus {
  NEW = 'NEW',
  FILLED = 'FILLED',
  CANCELLED = 'CANCELLED',
}
