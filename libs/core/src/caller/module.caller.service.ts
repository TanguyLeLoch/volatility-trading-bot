import { GridRequest } from '@model/common';
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

  async callOrderModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('order', method, path, body);
  }
  async callPlanModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('plan', method, path, body);
  }
  async callNetworkModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('network', method, path, body);
  }
  async callBrainModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('brain', method, path, body);
  }
  async callAsyncModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('async', method, path, body);
  }
  async callDiscordModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('discord', method, path, body);
  }
  async callBalanceModule(method: Method, path: string, body?: any): Promise<any> {
    return await this.callModule('balance', method, path, body);
  }

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

  async postRequest(request: GridRequest): Promise<any> {
    return await this.callModule(request.module, Method.POST, 'request', request);
  }

  private createFullUrl(module: string, path: string): string {
    const baseUrl = process.env.BASE_URL_DEV;
    const port: number = ports[module];
    return `${baseUrl}:${port}/${path}`;
  }
  private pingDiscord() {
    this.callDiscordModule(Method.POST, 'ping', null).catch((err) => {
      this.logger.error(`launch ping to discord`);
      this.logger.error(`Error pinging message on discord: ${err}`);
    });
  }
}
