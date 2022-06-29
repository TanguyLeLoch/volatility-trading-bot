import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from '../method';
import { ports } from '../module.ports';

@Injectable()
export class ModuleCallerSvc {
  private readonly logger = new Logger(ModuleCallerSvc.name);

  constructor(private httpService: HttpService) {}

  async callModule(
    module: string,
    method: Method,
    path: string,
    body: any,
  ): Promise<any> {
    const url = this.createFullUrl(module, path);
    this.logger.log(`url: ${url}`);
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
        this.logger.log(`trying to ping module ${module}`);
        const pingResponse = await this.httpService.axiosRef.get(
          `${process.env.BASE_URL_DEV}:${ports[module]}/ping`,
        );
        this.logger.log(`pingResponse: ${JSON.stringify(pingResponse)}`);
        this.logger.log(`module ${module} is running`);
      } catch (error) {
        this.logger.log(`module ${module} is down`);
        this.logger.log(`error: ${JSON.stringify(error)}`);
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
