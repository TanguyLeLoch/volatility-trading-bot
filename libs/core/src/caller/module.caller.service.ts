import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { Method } from '../method';
import { apiKeyMiddlewareheader } from '../middleware/api.middleware';
import { getModuleName, ports } from '../module.ports';

@Injectable()
export class ModuleCallerSvc {
  private readonly logger: winston.Logger = createCustomLogger(getModuleName(), ModuleCallerSvc.name);

  constructor(private httpService: HttpService) {}

  async callModule(module: string, method: Method, path: string, body?: any): Promise<any> {
    const url = this.createFullUrl(module, path);
    this.logger.verbose(`${method} on module ${module} on url ${url} with body: ${JSON.stringify(body)}`);
    let response;
    try {
      response = await this.callOnce(method, url, body);
    } catch (error) {
      if (error.code !== 'ECONNREFUSED') {
        throw error;
      }
      this.logger.info(`module ${module} is down`);
      if (module !== 'discord' && path !== 'ping') {
        this.pingDiscord();
      }
      this.logger.info(`error: ${JSON.stringify(error)}`);
      throw error;
    }
    return response.data;
  }
  async callOnce(method: Method, url: string, body?: any): Promise<any> {
    const headers = {} as any;
    headers[apiKeyMiddlewareheader] = process.env.API_KEY_GRID_TRADING;
    return await this.httpService.axiosRef({
      method,
      url,
      data: body,
      headers,
    });
  }
  private createFullUrl(module: string, path: string): string {
    const baseUrl = process.env.BASE_URL_DEV;
    const port: number = ports[module];
    return `${baseUrl}:${port}/${path}`;
  }
  private pingDiscord() {
    this.callModule('discord', Method.POST, 'ping', null).catch((err) => {
      this.logger.error(`launch ping to discord`);
      this.logger.error(`Error pinging message on discord: ${err}`);
    });
  }
}
