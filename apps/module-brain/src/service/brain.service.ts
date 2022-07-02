import { Injectable } from '@nestjs/common';
import { ModuleCallerSvc } from '@app/core';
import { Method } from '@app/core';
import { Plan } from '@model/plan';
import { AsyncCall, AsyncStatus } from '@model/async';
import { Exchange } from '@model/network';

const TIME_BETWEEN_CALL = 60 * 1; // 1 minute

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

    const asyncCall: AsyncCall = this.createAsyncSynchronise(planId);
    await this.sendAsync(asyncCall);
    return sentOrders;
  }
  private async sendAsync(asyncCall: AsyncCall) {
    await this.moduleCallerSvc.callModule(
      'async',
      Method.POST,
      'asyncs',
      asyncCall,
    );
  }

  private createAsyncSynchronise(planId: string) {
    const asyncCall: AsyncCall = new AsyncCall();
    const dateToCall = new Date();
    dateToCall.setSeconds(dateToCall.getSeconds() + TIME_BETWEEN_CALL);
    asyncCall.dateToCall = dateToCall;
    asyncCall.status = AsyncStatus.OPEN;
    asyncCall.method = Method.POST;
    asyncCall.module = 'brain';
    asyncCall.url = `synchronize/${planId}`;
    return asyncCall;
  }

  async synchronize(planId: string): Promise<Exchange[]> {
    const exchanges: Exchange[] = await this.moduleCallerSvc.callModule(
      'order',
      Method.POST,
      `orders/synchronize/${planId}`,
      null,
    );
    this.sendAsync(this.createAsyncSynchronise(planId));
    return exchanges;
  }
}
