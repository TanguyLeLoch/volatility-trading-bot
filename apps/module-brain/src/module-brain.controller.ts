import { Controller, Get } from '@nestjs/common';
import { ModuleBrainService } from './module-brain.service';

@Controller()
export class ModuleBrainController {
  constructor(private readonly moduleBrainService: ModuleBrainService) {}

  @Get()
  getHello(): string {
    return this.moduleBrainService.getHello();
  }
}
