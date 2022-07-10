import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from '../method';
import { getModuleName, ports } from '../module.ports';
import winston from 'winston';
import { createCustomLogger } from '../logger';

@Injectable()
export class ModuleCallerSvc {
  private readonly logger: winston.Logger = createCustomLogger(getModuleName(), ModuleCallerSvc.name);

  constructor(private httpService: HttpService) {}

  async callModule(module: string, method: Method, path: string, body?: any): Promise<any> {
    const url = this.createFullUrl(module, path);
    this.logger.verbose(`${method} on module ${module} on url ${url} with body: ${JSON.stringify(body)}`);
    let response;
    try {
      response = await this.httpService.axiosRef({
        method,
        url,
        data: body,
      });
    } catch (error) {
      if (error.code !== 'ECONNREFUSED') {
        throw error;
      }
      try {
        this.logger.info(`trying to ping module ${module}`);
        const pingResponse = await this.httpService.axiosRef.get(`${process.env.BASE_URL_DEV}:${ports[module]}/ping`);
        this.logger.info(`pingResponse: ${JSON.stringify(pingResponse)}`);
        this.logger.info(`module ${module} is running`);
      } catch (error) {
        this.logger.info(`module ${module} is down`);
        this.logger.info(`error: ${JSON.stringify(error)}`);
        throw error;
      }
    }
    return response.data;
  }

  createFullUrl(module: string, path: string): string {
    const baseUrl = process.env.BASE_URL_DEV;
    const port: number = ports[module];
    return `${baseUrl}:${port}/${path}`;
  }
}
