import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class CexBalance {
  _id?: string;
  __v?: string;
  @Prop({ type: String })
  asset: string;
  @Prop({ type: String })
  free: string;
  @Prop({ type: String })
  locked: string;
  @Prop({ type: String })
  platform: string; // used in stub only
}

export const CexBalanceSchema = SchemaFactory.createForClass(CexBalance);
