import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExchangeStatus } from './exchange.status';

@Schema()
export class Exchange {
  public _id: string;
  public __v: string;
  @Prop()
  public date: number;
  @Prop()
  public status: ExchangeStatus;
  @Prop()
  public url: string;
  @Prop({ type: Object })
  public content: Object;

  constructor(
    date: number,
    status: ExchangeStatus,
    url: string,
    content: Object,
  ) {
    this.date = date;
    this.status = status;
    this.url = url;
    this.content = content;
  }
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
