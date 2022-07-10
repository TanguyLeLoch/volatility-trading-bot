import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from '../method';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { getModuleName } from '../module.ports';
import { Utils } from '@model/common';

const statusToRetry = [408, 429, 500, 502, 503, 504];

@Injectable()
export class ExternalCallerSvc {
  private readonly logger: winston.Logger = createCustomLogger(getModuleName(), ExternalCallerSvc.name);
  constructor(private httpService: HttpService) {}

  async callExternal(method: Method, url: string, body?: any, headers?: any): Promise<any> {
    this.logger.debug(`${method} on url ${url} with body: ${JSON.stringify(body)}`);

    let response: any;
    let nbRetry = 10;
    while (!response) {
      try {
        response = await this.callOnce(method, url, body, headers);
      } catch (error) {
        this.logger.error(`Error while calling ${url} with body: ${JSON.stringify(body)}`);
        this.logger.error(`error: ${JSON.stringify(error)}`);
        if (nbRetry === 0) {
          throw new Error(`NO_MORE_RETRY`);
        } else if (statusToRetry.includes(error.status)) {
          this.logger.error(`Error code ${error.status} is retryable, retry in 10 seconds`);
          nbRetry--;
          await Utils.sleep(10000);
        } else {
          this.logger.error(`Error code ${error.status} is not retryable, abort`);
          throw new Error(`${error.status}_NOT_RETRYABLE`);
        }
      }
    }
    return response;
  }
  async callOnce(method: Method, url: string, body?: any, headers?: any) {
    return await this.httpService.axiosRef({
      method,
      url,
      data: body,
      headers,
    });
  }
}
