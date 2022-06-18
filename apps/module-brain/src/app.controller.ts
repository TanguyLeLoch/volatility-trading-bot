import { Controller, Get, Logger } from '@nestjs/common';
import { BrainSvc } from './service/brain.service';

@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private brainSvc: BrainSvc) {}

  @Get('run')
  run(): Promise<any> {
    this.logger.log('run');
    return this.brainSvc.run();
  }
  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
