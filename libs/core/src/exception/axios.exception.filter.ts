import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class AxiosExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    if (exception.constructor.name === 'AxiosError') {
      const ctx = host.switchToHttp();
      const response = ctx.getResponse<Response>();
      const request = ctx.getRequest<Request>();
      const status = exception.response.data.statusCode;
      const content = JSON.parse(exception.response.data.message);
      const resp = {
        statusCode: status,
        code: content.code,
        timestamp: new Date().toISOString(),
        path: request.url,
      };
      response.statusCode = resp.code;
      response.status(status).json(resp);
    } else {
      throw exception;
    }
  }
}
