import { Injectable } from '@nestjs/common';
import { ModuleCallerSvc } from '@app/core';
import { Method } from '@app/core';
import { Plan } from '@model/plan';
import { AsyncCall, AsyncStatus } from '@model/async';

const TIME_BETWEEN_CALL = 60 * 3; // 3 minutes

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

    const asyncCall: AsyncCall = new AsyncCall();
    const dateToCall = new Date();
    dateToCall.setSeconds(dateToCall.getSeconds() + TIME_BETWEEN_CALL);
    asyncCall.dateToCall = dateToCall;
    asyncCall.status = AsyncStatus.OPEN;
    asyncCall.method = Method.POST;
    asyncCall.module = 'brain';
    asyncCall.url = `synchronize/${planId}`;
    await this.moduleCallerSvc.callModule(
      'async',
      Method.POST,
      'asyncs',
      asyncCall,
    );
    return sentOrders;
  }
  synchronize(planId: string): Promise<any> {
    return this.moduleCallerSvc.callModule(
      'order',
      Method.POST,
      `synchronize/${planId}`,
      null,
    );
  }
}
