import { Controller, Get } from '@nestjs/common';

@Controller()
export class PingController {
  @Get('ping')
  ping(): string {
    return 'pong';
  }
}
