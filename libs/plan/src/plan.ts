import { Pair } from '@model/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Plan {
  public _id: string;
  public __v: string;

  @Prop({ type: Pair, required: true })
  public pair: Pair;
  @Prop({ type: String, required: true })
  public platform: string;
  @Prop({ type: Number, required: true })
  public priceMin: number;
  @Prop({ required: true })
  public step: number;
  @Prop({ type: Number, required: true })
  public startAmount: number;
  @Prop({ type: Number, required: true })
  public amountPerStep: number;
  @Prop({ type: Array, required: true })
  public stepLevels: Array<number> = [];

  constructor(
    pair: Pair,
    platform: string,
    priceMin: number,
    step: number,
    startAmount: number,
    amountPerStep: number,
  ) {
    this.pair = pair;
    this.platform = platform;
    this.priceMin = priceMin;
    this.step = step;
    this.startAmount = startAmount;
    this.amountPerStep = amountPerStep;
    this.stepLevels = [];
  }
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
