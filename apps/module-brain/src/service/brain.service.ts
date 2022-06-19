import { Injectable } from '@nestjs/common';
import { ModuleCallerSvc } from '@app/core';
import { Method } from '@app/core';
import { Plan } from '@model/plan';

@Injectable()
export class BrainSvc {
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async init(plan: Plan): Promise<any> {
    return this.moduleCallerSvc.callModule(
      'plan',
      Method.POST,
      `plans/computeStep/${plan._id}`,
      null,
    );
  }
}
