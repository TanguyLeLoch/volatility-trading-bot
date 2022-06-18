import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleBrainService {
  getHello(): string {
    return 'Hello World!';
  }
}
