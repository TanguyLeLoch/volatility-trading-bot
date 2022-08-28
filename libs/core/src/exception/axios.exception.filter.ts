import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { getModuleName } from '../module.ports';

@Catch()
export class AxiosExceptionFilter implements ExceptionFilter {
  private readonly logger: winston.Logger = createCustomLogger(getModuleName(), AxiosExceptionFilter.name);
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    if (exception.constructor.name === 'AxiosError') {
      const status = exception.response?.data?.statusCode;
      const content = exception.response.data.message;
      this.logger.error(`${request.method} ${request.url} ${status} ${content}`);
      const resp = {
        statusCode: status,
        code: content.code,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      response.statusCode = resp.code;
      response.status(status).json(resp);
    } else {
      response.status(400).json({
        statusCode: 400,
        code: 'UNKNOWN_ERROR',
        timestamp: new Date().toISOString(),
        path: request.url,
      });
    }
  }
}
