import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Pair, Platform } from '@model/common';

@Schema({ timestamps: true })
export class PairInfoDocument {
  @Prop({ type: Pair, required: true })
  public readonly pair: Pair;

  @Prop({ type: String, required: true })
  public readonly platform: Platform;

  @Prop({ required: true })
  public readonly orderTypes: string[];

  @Prop({ required: true })
  public readonly stepSize: number;

  public readonly updatedAt: Date;

  constructor(pair: Pair, orderTypes: string[], stepSize: number, platform: Platform) {
    this.pair = pair;
    this.orderTypes = orderTypes;
    this.stepSize = stepSize;
    this.platform = platform;
  }
}

export const PairInfoSchema = SchemaFactory.createForClass(PairInfoDocument);
