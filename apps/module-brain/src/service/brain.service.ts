import { Injectable } from '@nestjs/common';
import { createCustomLogger, ModuleCallerSvc } from '@app/core';
import { Method } from '@app/core';
import { Plan } from '@model/plan';
import { AsyncCall, AsyncStatus } from '@model/async';
import { Exchange } from '@model/network';
import winston from 'winston';
import { moduleName } from '../main';

const TIME_BETWEEN_CALL = 60 * 5; // 5 minutes

@Injectable()
export class BrainSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, BrainSvc.name);
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async init(planId: string): Promise<any> {
    const planWithStep: Plan = await this.moduleCallerSvc.callModule(
      'plan',
      Method.POST,
      `plans/computeStep/${planId}`,
      null,
    );
    //create initial orders
    const orders = await this.moduleCallerSvc.callModule('order', Method.POST, 'orders/plan', planWithStep);

    const asyncCall: AsyncCall = this.createAsyncSynchronise(planId);
    await this.sendAsync(asyncCall);
    return orders;
  }
  private async sendAsync(asyncCall: AsyncCall): Promise<AsyncCall> {
    return await this.moduleCallerSvc.callModule('async', Method.POST, 'asyncs', asyncCall);
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
    const asyncToCreate: AsyncCall = this.createAsyncSynchronise(planId);
    await this.sendAsync(asyncToCreate);
    this.logger.info(`Next async at: ${asyncToCreate.dateToCall}`);

    return exchanges;
  }
}
