import { Pair } from '@model/common';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { FeatureOverride } from '@model/plan/FeatureOverride';

@Schema()
export class Plan {
  public _id: string;
  public __v: number;

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
  @Prop({ type: Object })
  public featureOverride: FeatureOverride;
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

export class PlanBuilder {
  _id: string;
  __v: number;
  private pair: Pair;
  private platform: string;
  private priceMin: number;
  private step: number;
  private startAmount: number;
  private amountPerStep: number;
  private stepLevels: Array<number> = [];
  private featureOverride: FeatureOverride;

  withId(id: string): PlanBuilder {
    this._id = id;
    return this;
  }

  withPair(pair: Pair): PlanBuilder {
    this.pair = pair;
    return this;
  }

  withPlatform(platform: string): PlanBuilder {
    this.platform = platform;
    return this;
  }

  withPriceMin(priceMin: number): PlanBuilder {
    this.priceMin = priceMin;
    return this;
  }

  withStep(step: number): PlanBuilder {
    this.step = step;
    return this;
  }

  withStartAmount(startAmount: number): PlanBuilder {
    this.startAmount = startAmount;
    return this;
  }

  withAmountPerStep(amountPerStep: number): PlanBuilder {
    this.amountPerStep = amountPerStep;
    return this;
  }

  withStepLevels(stepLevels: Array<number>): PlanBuilder {
    this.stepLevels = stepLevels;
    return this;
  }

  withFeatureOverride(featureOverride: FeatureOverride): PlanBuilder {
    this.featureOverride = featureOverride;
    return this;
  }

  build(): Plan {
    const plan = new Plan();
    plan._id = this._id;
    plan.pair = this.pair;
    plan.platform = this.platform;
    plan.priceMin = this.priceMin;
    plan.step = this.step;
    plan.startAmount = this.startAmount;
    plan.amountPerStep = this.amountPerStep;
    plan.stepLevels = this.stepLevels;
    plan.featureOverride = this.featureOverride;
    return plan;
  }
}
