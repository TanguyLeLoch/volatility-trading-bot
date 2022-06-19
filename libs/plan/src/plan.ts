import { Pair } from '@model/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class Plan {
  public _id: string;
  public __v: string;

  @Prop({ type: Pair, required: true })
  public pair: Pair;
  @Prop({ type: String, required: true })
  public plateform: string;
  @Prop({ type: Number, required: true })
  public priceMin: number;
  @Prop({ required: true })
  public step: number;
  @Prop({ type: Number, required: true })
  public startAmount: number;
  @Prop({ type: Number, required: true })
  public amountPerStep: number;
  @Prop({ type: Array, required: true })
  public computedSteps: Array<number> = [];

  constructor(
    pair: Pair,
    plateform: string,
    priceMin: number,
    step: number,
    startAmount: number,
    amountPerStep: number,
  ) {
    this.pair = pair;
    this.plateform = plateform;
    this.priceMin = priceMin;
    this.step = step;
    this.startAmount = startAmount;
    this.amountPerStep = amountPerStep;
    this.computedSteps = [];
  }
}

export const PlanSchema = SchemaFactory.createForClass(Plan);
