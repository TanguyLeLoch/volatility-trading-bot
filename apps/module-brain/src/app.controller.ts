import { AxiosExceptionFilter, createCustomLogger } from '@app/core';
import { Controller, Param, Post, UseFilters } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from './module.info';
import { BrainSvc } from './service/brain.service';

@Controller()
export class AppController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, AppController.name);
  constructor(private brainSvc: BrainSvc) {}

  @Post('init/:planId')
  init(@Param('planId') planId: string): Promise<any> {
    this.logger.info(`init for plan id ${planId}`);
    return this.brainSvc.init(planId);
  }

  @Post('synchronize/:planId')
  @UseFilters(AxiosExceptionFilter)
  synchronize(@Param('planId') planId: string): Promise<any> {
    this.logger.info(`synchronize for plan id ${planId}`);
    return this.brainSvc.synchronize(planId);
  }
}
