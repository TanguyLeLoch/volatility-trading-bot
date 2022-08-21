import { createCustomLogger } from '@app/core';
import { Exchange } from '@model/network';
import { Controller, Get, Param, Post } from '@nestjs/common';
import winston from 'winston';
import { moduleName } from '../module.info';
import { SynchronizeSvc } from '../service/synchronise.service';

@Controller('synchronize')
export class SynchronizeController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, SynchronizeController.name);
  constructor(private synchronizeSvc: SynchronizeSvc) {}

  @Get()
  get() {
    this.logger.info(`sGET`);
  }

  @Post('planId/:planId')
  synchronize(@Param('planId') planId: string): Promise<Exchange[]> {
    this.logger.info(`synchronize balances with for plan id ${planId}`);
    return this.synchronizeSvc.synchronize(planId);
  }
}
