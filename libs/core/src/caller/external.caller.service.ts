import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from '../method';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { getModuleName } from '../module.ports';

@Injectable()
export class ExternalCallerSvc {
  private readonly logger: winston.Logger = createCustomLogger(getModuleName(), ExternalCallerSvc.name);
  constructor(private httpService: HttpService) {}

  async callExternal(method: Method, url: string, body?: any, headers?: any): Promise<any> {
    this.logger.debug(`${method} on url ${url} with body: ${JSON.stringify(body)}`);

    let response: any;
    try {
      response = await this.httpService.axiosRef({
        method,
        url,
        data: body,
        headers,
      });
    } catch (error) {
      this.logger.error(error.response.data);
      this.logger.error(`error: ${JSON.stringify(error)}`);
      throw error;
    }
    return response;
  }
}
