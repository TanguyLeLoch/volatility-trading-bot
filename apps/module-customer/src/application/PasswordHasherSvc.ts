import { Injectable } from '@nestjs/common';

@Injectable
export class PasswordHasherSvc {
  constructor() {
    console.log('construct');
  }

  public hash(password: string): string {
    return 'hash';
  }
}
