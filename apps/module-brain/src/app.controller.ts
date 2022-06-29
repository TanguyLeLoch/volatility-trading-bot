import { Body, Controller, Get, Logger, Param, Post } from '@nestjs/common';
import { BrainSvc } from './service/brain.service';
import { v4 as uuidv4 } from 'uuid';
import { Plan } from '@model/plan';
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private brainSvc: BrainSvc) {}

  @Post('init/:planId')
  init(@Param() { planId }: { planId: string }): Promise<any> {
    this.logger.log(`init with for plan id ${planId}`);
    this.logger.warn(`trxUuid : + ${generateTrxUuid()}`);
    return this.brainSvc.init(planId);
  }

  @Post('synchronize/:planId')
  synchronize(@Param() { planId }: { planId: string }): Promise<any> {
    this.logger.log(`synchronize with for plan id ${planId}`);
    return this.brainSvc.synchronize(planId);
  }
}

function generateTrxUuid(): string {
  const uuid = uuidv4();
  return uuid;
}
