import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { Method } from '../method';
import { getModuleName } from '../module.ports';
import { ExternalCallback } from '@app/core/caller/external.callback';
import { Utils } from '@model/common';

@Injectable()
export class ExternalCallerSvc {
  private readonly logger: winston.Logger = createCustomLogger(getModuleName(), ExternalCallerSvc.name);

  constructor(private httpService: HttpService) {}

  async callExternal(
    method: Method,
    url: string,
    body?: object,
    headers?: object,
    callbacks?: ExternalCallback,
  ): Promise<any> {
    this.logger.debug(`${method} on url ${url} with body: ${JSON.stringify(body)}`);
    let response: any;
    try {
      const res = await this.callOnce(method, url, body, headers);
      response = res.data;
    } catch (error: any) {
      this.logger.warn(`Failed to call once url : ${url}`);
      this.logError(error);
      const status = this.getStatus(error);
      if (status !== undefined && callbacks !== undefined) {
        this.logger.debug(`Calling callback for status ${status}`);
        await Utils.sleep(3000);
        response = await callbacks.call(status);
      } else {
        throw error;
      }
    }
    return response;
  }

  async callOnce(method: Method, url: string, body?: object, headers?: object): Promise<any> {
    return this.httpService.axiosRef({
      method,
      url,
      data: body,
      headers,
    } as any);
  }

  private logError(error: any): void {
    let message: string;
    try {
      message = JSON.stringify(error);
    } catch (parsingError: any) {
      message = error;
    }
    try {
      this.logger.warn(error.response.data);
      this.logger.warn(error.response.status);
      this.logger.warn(error.response.headers);
    } catch (error: any) {
      this.logger.error('Failed to log error');
    }
    this.logger.error(message);
  }

  private getStatus(error: any): number | undefined {
    const errorParsed = JSON.parse(JSON.stringify(error));
    return errorParsed.status;
  }
}
