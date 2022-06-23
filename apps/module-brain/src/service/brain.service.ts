import { Injectable } from '@nestjs/common';
import { ModuleCallerSvc } from '@app/core';
import { Method } from '@app/core';
import { Plan } from '@model/plan';

@Injectable()
export class BrainSvc {
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async init(planId: string): Promise<any> {
    const planWithStep: Plan = await this.moduleCallerSvc.callModule(
      'plan',
      Method.POST,
      `plans/computeStep/${planId}`,
      null,
    );
    const orders = await this.moduleCallerSvc.callModule(
      'order',
      Method.POST,
      'orders/plan',
      planWithStep,
    );
    const sentOrders = await this.moduleCallerSvc.callModule(
      'network',
      Method.POST,
      'dex/postOrders',
      orders,
    );
    return sentOrders;
  }
}
