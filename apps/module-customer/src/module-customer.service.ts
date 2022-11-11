import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleCustomerService {
  getHello(): string {
    return 'Hello World!';
  }
}
