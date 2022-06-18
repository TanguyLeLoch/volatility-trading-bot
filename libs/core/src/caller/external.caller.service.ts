import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Method } from '../method';

@Injectable()
export class ExternalCallerSvc {
  private readonly logger = new Logger(ExternalCallerSvc.name);

  constructor(private httpService: HttpService) {}

  async callExternal(method: Method, url: string, body: any): Promise<any> {
    this.logger.log(`url: ${url}`);
    const response = await this.httpService.axiosRef({
      method,
      url,
      data: body,
    });

    return response.data;
  }
}
