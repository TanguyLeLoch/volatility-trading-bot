import { Pair, Platform } from '@model/common';

export class PairInfo {
  private readonly pair: Pair;
  private readonly platform: Platform;
  private readonly orderTypes: string[];
  private readonly stepSize: number;
  private readonly updatedAt: Date;

  private static readonly VALIDITY_PERIOD = 1000 * 60 * 60 * 24; // 1 day

  public get Pair(): Pair {
    return this.pair;
  }

  public get Platform(): Platform {
    return this.platform;
  }

  public get OrderTypes(): string[] {
    return this.orderTypes;
  }

  public get StepSize(): number {
    return this.stepSize;
  }

  constructor(pair: Pair, orderTypes: string[], stepSize: number | undefined, platform: Platform, updatedAt: Date) {
    this.pair = pair;
    this.orderTypes = orderTypes;
    this.platform = platform;
    this.updatedAt = updatedAt;
    if (stepSize === undefined) {
      throw new Error('Step size cannot be undefined');
    }
    this.stepSize = stepSize;
  }

  public isExpired(): boolean {
    return this.updatedAt.getTime() + PairInfo.VALIDITY_PERIOD < Date.now();
  }

  public isMarketTypeSupported(): boolean {
    return this.orderTypes.includes('MARKET');
  }
}
