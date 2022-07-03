import { ModuleCallerSvc } from '@app/core';
import { AsyncCall, AsyncFilter, AsyncStatus } from '@model/async';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnModuleDestroy,
} from '@nestjs/common';
import { CronJob } from 'cron';
import { AsyncSvc } from './async.service';

@Injectable()
export class AsyncEngineSvc implements OnApplicationBootstrap, OnModuleDestroy {
  private readonly logger = new Logger(AsyncEngineSvc.name);
  private cronJob: CronJob;
  constructor(
    private readonly asyncSvc: AsyncSvc,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}
  onApplicationBootstrap() {
    this.logger.warn(`Initialization of async engine ...`);
    this.cronJob = this.createCronJob();
    this.startCronJob(this.cronJob);
  }

  onModuleDestroy() {
    this.logger.warn(`Shutdown of async engine ...`);
    this.cronJob.stop();
  }

  private createCronJob(): CronJob {
    // run every 5 seconds
    const cronJob = new CronJob('*/5 * * * * *', () => this.processAsyncCall());
    return cronJob;
  }
  private startCronJob(cronJob: CronJob): void {
    cronJob.start();
  }
  private async processAsyncCall(): Promise<void> {
    // get all async calls at OPEN status ready for exec
    const asyncCalls = await this.findAsyncCallToExecute();
    if (asyncCalls.length > 0) {
      this.logger.warn(`Found ${asyncCalls.length} async calls to process ...`);
      await this.executeAsyncCalls(asyncCalls);
    }
  }
  private async findAsyncCallToExecute() {
    const filter: AsyncFilter = {
      status: AsyncStatus.OPEN,
      dateToCallLessThan: new Date(),
    };
    const asyncCalls = await this.asyncSvc.findWithFilter(filter);
    return asyncCalls;
  }

  private async executeAsyncCalls(asyncCalls: AsyncCall[]): Promise<void> {
    for (let asyncCall of asyncCalls) {
      asyncCall = await this.executeAsyncCall(asyncCall);
    }
  }

  private async executeAsyncCall(asyncCall: AsyncCall) {
    this.logger.log(`Processing async call: ${JSON.stringify(asyncCall)}`);
    // update status to IN_PROGRESS
    asyncCall.status = AsyncStatus.IN_PROGRESS;
    asyncCall = await this.asyncSvc.modify(asyncCall);
    // make call
    const response = await this.moduleCallerSvc.callModule(
      asyncCall.module,
      asyncCall.method,
      asyncCall.url,
      asyncCall.body,
    );
    this.logger.log(`Response: ${JSON.stringify(response)}`);
    // update status to DONE
    asyncCall.status = AsyncStatus.DONE;
    asyncCall = await this.asyncSvc.modify(asyncCall);
    return asyncCall;
  }
}
