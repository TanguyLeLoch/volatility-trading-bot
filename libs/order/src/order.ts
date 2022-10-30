import { Pair } from '@model/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class Order {
  public _id?: string;
  public __v?: number;
  @Prop({ required: true })
  public planId?: string;
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
  public createdAt?: string;
  public updatedAt?: string;
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
  PARTIALLY_FILLED = 'PARTIALLY_FILLED',
  CANCELLED = 'CANCELLED',
}

export type FilterRequest = {
  status?: OrderStatus | OrderStatus[];
};

export class OrderBuilder {
  private _id?: string;
  private __v?: number;
  private planId: string;
  private pair: Pair;
  private amount: number;
  private status: OrderStatus;
  private price: OrderPrice;
  private side: Side;
  public updatedAt?: string;

  withId(id: string): OrderBuilder {
    this._id = id;
    return this;
  }

  withVersion(v: number): OrderBuilder {
    this.__v = v;
    return this;
  }

  withPlanId(planId: string): OrderBuilder {
    this.planId = planId;
    return this;
  }

  withPair(pair: Pair): OrderBuilder {
    this.pair = pair;
    return this;
  }

  withAmount(amount: number): OrderBuilder {
    this.amount = amount;
    return this;
  }

  withStatus(status: OrderStatus): OrderBuilder {
    this.status = status;
    return this;
  }

  withPrice(price: OrderPrice): OrderBuilder {
    this.price = price;
    return this;
  }

  withSide(side: Side): OrderBuilder {
    this.side = side;
    return this;
  }

  withUpdatedAt(updatedAt: string): OrderBuilder {
    this.updatedAt = updatedAt;
    return this;
  }

  build(): Order {
    const order = new Order();
    order._id = this._id;
    order.__v = this.__v;
    order.planId = this.planId;
    order.pair = this.pair;
    order.amount = this.amount;
    order.status = this.status;
    order.price = this.price;
    order.side = this.side;
    order.updatedAt = this.updatedAt;
    return order;
  }
}
