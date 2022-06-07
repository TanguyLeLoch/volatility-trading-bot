import { Controller, Get } from '@nestjs/common';

@Controller('ping')
export class AppController {
  @Get()
  Ping(): string {
    return 'pong';
  }
}
