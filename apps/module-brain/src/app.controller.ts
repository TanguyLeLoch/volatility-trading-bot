import { Body, Controller, Get, Logger, Post } from '@nestjs/common';
import { BrainSvc } from './service/brain.service';
import { v4 as uuidv4 } from 'uuid';
import { Plan } from '@model/plan';
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private brainSvc: BrainSvc) {}

  @Post('init')
  init(@Body() plan: Plan): Promise<any> {
    this.logger.log(`init with for plan id ${plan._id}`);
    this.logger.warn(`trxUuid : + ${generateTrxUuid()}`);
    return this.brainSvc.init(plan);
  }
  @Get('ping')
  ping(): string {
    return 'pong';
  }
}

function generateTrxUuid(): string {
  const uuid = uuidv4();
  return uuid;
}
