import { Method } from '@app/core';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class AsyncCall {
  public _id: string;
  public __v: string;

  @Prop({ required: true })
  public dateToCall: Date;
  @Prop({ type: String, required: true })
  public status: AsyncStatus;
  @Prop({ type: String, required: true })
  public method: Method;
  @Prop({ required: true })
  public module: string;
  @Prop({ required: true })
  public url: string;
  @Prop({ type: Object })
  public body: any;
}

export const AsyncCallSchema = SchemaFactory.createForClass(AsyncCall);

export enum AsyncStatus {
  OPEN = 'OPEN',
  DONE = 'DONE',
  CANCELLED = 'CANCELLED',
}
