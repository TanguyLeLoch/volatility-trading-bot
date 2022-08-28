import { Pair } from '@model/common';

export type GridRequest = {
  module: string;
  name: string;
};
export interface RecomputeStepRequest extends GridRequest {
  planId: string;
  pair: Pair;
}

export interface IncreaseCeilingRequest extends GridRequest {
  planId: string;
}
