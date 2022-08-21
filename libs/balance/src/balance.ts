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

export class BalanceBuilder {
  public _id: string;
  public token: string;
  public platform: string;
  public inOrder: number;
  public available: number;

  public withId(id: string): BalanceBuilder {
    this._id = id;
    return this;
  }
  public withToken(token: string): BalanceBuilder {
    this.token = token;
    return this;
  }
  public withPlatform(platform: string): BalanceBuilder {
    this.platform = platform;
    return this;
  }
  public withInOrder(inOrder: number): BalanceBuilder {
    this.inOrder = inOrder;
    return this;
  }
  public withAvailable(available: number): BalanceBuilder {
    this.available = available;
    return this;
  }
  public build(): Balance {
    const balance = new Balance();
    balance._id = this._id;
    balance.token = this.token;
    balance.platform = this.platform;
    balance.inOrder = this.inOrder;
    balance.available = this.available;
    return balance;
  }
}
