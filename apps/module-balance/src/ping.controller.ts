import { Controller, Get } from '@nestjs/common';
@Controller('ping')
export class PingController {
  @Get()
  Ping(): string {
    return 'pong';
  }
}
