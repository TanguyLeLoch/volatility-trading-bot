import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Balance } from '@model/balance';
import { Exchange, GetBalancesRequest } from '@model/network';
import { Plan } from '@model/plan';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { BalanceSvc } from '../service/balance.service';

@Injectable()
export class SynchronizeSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, SynchronizeSvc.name);
  constructor(private balanceSvc: BalanceSvc, private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async synchronize(planId: string): Promise<Exchange[]> {
    const plan: Plan = await this.moduleCallerSvc.callModule('plan', Method.GET, `plans/${planId}`, null);
    const request: GetBalancesRequest = {
      pair: plan.pair,
      platform: plan.platform,
    };

    const balances: Balance[] = await this.moduleCallerSvc.callModule('network', Method.POST, `cex/balances`, request);
    return null;
  }
}
