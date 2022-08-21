import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { AsyncCall, AsyncFilter, AsyncStatus } from '@model/async';
import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import winston from 'winston';
import { AsyncSvc } from './async.service';
import { moduleName } from './module.info';

const ONE_HOUR = 60 * 60;
const NB_CYCLE_BYPASS = 2; // wait 10 sec before start
const TIME_BETWEEN_CYCLE = 5; // sec
@Injectable()
export class AsyncEngineSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, AsyncEngineSvc.name);
  private nbCycle = 0;

  constructor(private readonly asyncSvc: AsyncSvc, private readonly moduleCallerSvc: ModuleCallerSvc) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async processAsyncCall(): Promise<void> {
    if (this.nbCycle >= NB_CYCLE_BYPASS) {
      // get all async calls at OPEN status ready for exec
      const asyncCalls = await this.findAsyncCallToExecute();
      if (asyncCalls.length > 0) {
        this.logger.warn(`Found ${asyncCalls.length} async calls to process ...`);
        await this.executeAsyncCalls(asyncCalls);
      }
    } else {
      this.logger.info(
        `Waiting ${(NB_CYCLE_BYPASS - this.nbCycle) * TIME_BETWEEN_CYCLE} sec before the start of async triggering`,
      );
      this.nbCycle++;
    }
  }
  private async findAsyncCallToExecute() {
    const filter: AsyncFilter = {
      status: AsyncStatus.NEW,
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
    this.logger.debug(`Processing async call: ${JSON.stringify(asyncCall)}`);
    // update status to IN_PROGRESS
    asyncCall.status = AsyncStatus.IN_PROGRESS;
    asyncCall = await this.asyncSvc.modify(asyncCall);
    // make call
    try {
      await this.moduleCallerSvc.callModule(asyncCall.module, asyncCall.method, asyncCall.url, asyncCall.body);
      // delete async
      await this.asyncSvc.delete(asyncCall._id);
    } catch (error) {
      this.handleAsyncError(error);
      await this.retryAsyncCall(asyncCall, ONE_HOUR);
    }
    return asyncCall;
  }
  async retryAsyncCall(asyncCall: AsyncCall, delay: number) {
    this.logger.warn(`Retrying async call in one hour...`);
    asyncCall.status = AsyncStatus.NEW;
    const dateToCall = new Date();
    dateToCall.setSeconds(dateToCall.getSeconds() + delay);
    asyncCall.dateToCall = dateToCall;
    await this.asyncSvc.modify(asyncCall);
  }
  private handleAsyncError(error: any) {
    this.logger.error(`Error calling module: ${JSON.stringify(error)}`);
    const reason = error.response ? error.response.data.code : error.message;
    const datTime = error.response ? error.response.data.timestamp : new Date().toISOString();
    this.postMessageOnDiscord(`@here\nAsync call failed: ${reason} at ${datTime}`);
  }

  private postMessageOnDiscord(message: string) {
    this.moduleCallerSvc.callModule('discord', Method.POST, '', { content: message }).catch((err) => {
      this.logger.error(`Error posting message on discord: ${err}`);
    });
  }
}
