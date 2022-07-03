import { Controller, Logger, Param, Post } from '@nestjs/common';
import { BrainSvc } from './service/brain.service';
@Controller()
export class AppController {
  private readonly logger = new Logger(AppController.name);
  constructor(private brainSvc: BrainSvc) {}

  @Post('init/:planId')
  init(@Param() { planId }: { planId: string }): Promise<any> {
    this.logger.log(`init with for plan id ${planId}`);
    return this.brainSvc.init(planId);
  }

  @Post('synchronize/:planId')
  synchronize(@Param() { planId }: { planId: string }): Promise<any> {
    this.logger.log(`synchronize with for plan id ${planId}`);
    return this.brainSvc.synchronize(planId);
  }
}
