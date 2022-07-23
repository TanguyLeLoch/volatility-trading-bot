import { Injectable } from '@nestjs/common';

@Injectable()
export class StubService {
  getHello(): string {
    return 'Hello World!';
  }
}
