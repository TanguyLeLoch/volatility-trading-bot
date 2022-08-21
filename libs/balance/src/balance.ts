import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Balance {
  public _id: string;
  @Prop()
  public token: string;
  @Prop()
  public platform: string;
  @Prop()
  public inOrder: number;
  @Prop()
  public available: number;
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
