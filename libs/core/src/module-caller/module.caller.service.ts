import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from './method';
import { ports } from '../module.ports';
import 'dotenv';

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
    const baseUrl = process.env.BASE_URL_DEV;
    const port: number = ports[module];
    const url = `${baseUrl}:${port}/${path}`;
    this.logger.log(`url: ${url}`);
    const response = await this.httpService.axiosRef({
      method,
      url: path,
      data: body,
    });
    this.logger.log(`response: ${JSON.stringify(response)}`);

    return response.data;
  }
}
