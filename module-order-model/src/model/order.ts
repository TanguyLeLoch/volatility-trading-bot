import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Status } from './order.status';

@Schema()
export class Order {
  public _id: string;
  public __v: string;
  @Prop()
  public token1: string;
  @Prop()
  public token2: string;
  @Prop()
  public quantity: number;
  @Prop()
  public status: Status;

  constructor(
    token1: string,
    token2: string,
    quantity: number,
    status: Status,
  ) {
    this.token1 = token1;
    this.token2 = token2;
    this.quantity = quantity;
    this.status = status;
  }
}

export const OrderSchema = SchemaFactory.createForClass(Order);
