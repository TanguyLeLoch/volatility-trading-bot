import { HttpException, HttpStatus } from '@nestjs/common';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { getModuleName } from '../module.ports';
import { AxiosExceptionFilter } from './axios.exception.filter';

export class FunctionalException extends HttpException {
  private static readonly logger: winston.Logger = createCustomLogger(getModuleName(), AxiosExceptionFilter.name);

  constructor(message: string, code: string) {
    super(JSON.stringify({ code, message, timestamp: new Date().toISOString() }), HttpStatus.PRECONDITION_FAILED);
    FunctionalException.logger.error(FunctionalException.name + ': ' + code + `: ${message}\n${this.stack}`);
  }
}
