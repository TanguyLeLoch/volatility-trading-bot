import { HttpException, HttpStatus } from '@nestjs/common';

export class FunctionalException extends HttpException {
  message: string;
  code: string;
  constructor(message: string, code: string) {
    super('Functionnal exception : \n' + JSON.stringify({ code, message }), HttpStatus.PRECONDITION_FAILED);
    this.message = message;
    this.code = code;
  }
}
