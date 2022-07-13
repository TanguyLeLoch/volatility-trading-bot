import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Balance {
  public _id: string;
  @Prop()
  public token: string;
  @Prop()
  public platform: string;
  @Prop()
  public balance: number;
  @Prop()
  public inOrder: number;
  @Prop()
  public available: number;

  constructor(token: string, platform: string, balance: number, inOrder: number, available: number) {
    this.token = token;
    this.platform = platform;
    this.balance = balance;
    this.inOrder = inOrder;
    this.available = available;
  }
}

export const BalanceSchema = SchemaFactory.createForClass(Balance);
