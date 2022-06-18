import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from '../method';

@Injectable()
export class ExternalCallerSvc {
  private readonly logger = new Logger(ExternalCallerSvc.name);

  constructor(private httpService: HttpService) {}

  async callExternal(
    method: Method,
    url: string,
    body?: any,
    headers?: any,
  ): Promise<any> {
    this.logger.log(`url: ${url}`);
    let response;
    try {
      response = await this.httpService.axiosRef({
        method,
        url,
        data: body,
        headers,
      });
    } catch (error) {
      this.logger.error(error.response.data);

      this.logger.log(`error: ${JSON.stringify(error)}`);
      throw error;
    }
    return response;
  }
}