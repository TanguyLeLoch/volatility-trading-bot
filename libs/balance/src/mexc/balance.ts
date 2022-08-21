import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class MexcBalance {
  _id?: string;
  __v?: string;
  @Prop({ type: String })
  asset: string;
  @Prop({ type: String })
  free: string;
  @Prop({ type: String })
  locked: string;
}
export const MexcBalanceSchema = SchemaFactory.createForClass(MexcBalance);
