import { Controller, Get } from '@nestjs/common';
import { StubService } from './stub.service';

@Controller()
export class StubController {
  constructor(private readonly stubService: StubService) {}

  @Get()
  getHello(): string {
    return this.stubService.getHello();
  }
}
