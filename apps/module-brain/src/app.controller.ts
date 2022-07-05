import { createCustomLogger } from '@app/core';
import { Controller, Param, Post } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from './main';
import { BrainSvc } from './service/brain.service';

@Controller()
export class AppController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, AppController.name);
  constructor(private brainSvc: BrainSvc) {}

  @Post('init/:planId')
  init(@Param() { planId }: { planId: string }): Promise<any> {
    this.logger.info(`init for plan id ${planId}`);
    return this.brainSvc.init(planId);
  }

  @Post('synchronize/:planId')
  synchronize(@Param() { planId }: { planId: string }): Promise<any> {
    this.logger.info(`synchronize for plan id ${planId}`);
    return this.brainSvc.synchronize(planId);
  }
}
