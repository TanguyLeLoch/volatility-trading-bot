import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ExchangeStatus } from './exchange.status';

@Schema({ timestamps: true })
export class Exchange {
  public _id: string;
  public __v: string;
  @Prop({ required: true })
  public date: Date;
  @Prop({ type: String, required: true })
  public status: ExchangeStatus;
  @Prop({ required: true })
  public url: string;
  @Prop({ type: Object })
  public content: any;
}

export const ExchangeSchema = SchemaFactory.createForClass(Exchange);
