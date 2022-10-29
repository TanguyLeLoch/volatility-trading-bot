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
      response = await this.callOnce(method, url, body, headers);
    } catch (error: any) {
      this.logger.warn(`Failed to call once url : ${url}`);
      this.logError(error);
      const status = this.getStatus(error);
      if (status !== undefined && callbacks !== undefined) {
        this.logger.debug(`Calling callback for status ${status}`);
        await Utils.sleep(3000);
        response = callbacks.call(status);
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
      this.logger.debug('stringify');
    } catch (parsingError: any) {
      message = error;
      this.logger.debug('not stringify');
    }
    this.logger.error(message);
  }

  private getStatus(error: any): number | undefined {
    const errorParsed = JSON.parse(JSON.stringify(error));
    return errorParsed.status;
  }
}
