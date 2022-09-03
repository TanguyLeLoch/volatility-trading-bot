import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { AsyncCall, AsyncStatus } from '@model/async';
import { featureFlag, IncreaseCeilingRequest, RecomputeStepRequest } from '@model/common';
import { Exchange } from '@model/network';
import { Plan } from '@model/plan';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';

const TIME_BETWEEN_CALL = 60 * 5; // 5 minutes

@Injectable()
export class BrainSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, BrainSvc.name);
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async init(planId: string): Promise<any> {
    const planWithStep: Plan = await this.moduleCallerSvc.callPlanModule(
      Method.POST,
      `plans/computeStep/${planId}`,
      null,
    );
    //create initial orders
    const orders = await this.moduleCallerSvc.callOrderModule(Method.POST, 'orders/plan', planWithStep);

    const asyncCall: AsyncCall = this.createAsyncSynchronize(planId);
    await this.sendAsync(asyncCall);
    return orders;
  }
  private async sendAsync(asyncCall: AsyncCall): Promise<AsyncCall> {
    return await this.moduleCallerSvc.callAsyncModule(Method.POST, 'asyncs', asyncCall);
  }

  private createAsyncSynchronize(planId: string) {
    const asyncCall: AsyncCall = new AsyncCall();
    const dateToCall = new Date();
    dateToCall.setSeconds(dateToCall.getSeconds() + TIME_BETWEEN_CALL);
    asyncCall.dateToCall = dateToCall;
    asyncCall.status = AsyncStatus.NEW;
    asyncCall.method = Method.POST;
    asyncCall.module = 'brain';
    asyncCall.url = `synchronize/${planId}`;
    return asyncCall;
  }

  async synchronize(planId: string): Promise<Exchange[]> {
    const exchanges: Exchange[] = await this.moduleCallerSvc.callOrderModule(
      Method.POST,
      `orders/synchronize/${planId}`,
      null,
    );
    if (featureFlag.increaseCeiling) {
      this.logger.error('increaseCeiling is enabled');
      await this.increaseCeiling(exchanges, planId);
    } else {
      this.logger.error('increaseCeiling is disabled');
    }

    const asyncToCreate: AsyncCall = this.createAsyncSynchronize(planId);
    await this.sendAsync(asyncToCreate);
    this.logger.info(`Next async at: ${asyncToCreate.dateToCall}`);

    return exchanges;
  }

  private async increaseCeiling(exchanges: Exchange[], planId: string) {
    //FIXME remove true
    if (true || (exchanges && exchanges.length > 0)) {
      await this.moduleCallerSvc.callBalanceModule(Method.POST, `synchronize/planId/${planId}`, null);
      const plan: Plan = await this.moduleCallerSvc.callPlanModule(Method.GET, `plans/${planId}`, null);
      const request: RecomputeStepRequest = {
        module: 'plan',
        planId: planId,
        pair: plan.pair,
        name: 'recomputeStep',
      };
      const planModified = await this.moduleCallerSvc.callPlanModule(Method.POST, `request`, request);
      if (plan.stepLevels.length !== planModified.stepLevels.length) {
        const request: IncreaseCeilingRequest = {
          module: 'order',
          planId: planId,
          name: 'increaseCeiling',
        };
        await this.moduleCallerSvc.callOrderModule(Method.POST, 'request', request);
      }
    } else {
      this.logger.info('There is no need to increaseCeiling because pair are synced');
    }
  }
}
