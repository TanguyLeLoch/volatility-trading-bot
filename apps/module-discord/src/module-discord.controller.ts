import { Controller, Get } from '@nestjs/common';
import { ModuleDiscordService } from './module-discord.service';

@Controller()
export class ModuleDiscordController {
  constructor(private readonly moduleDiscordService: ModuleDiscordService) {}

  @Get()
  getHello(): string {
    return this.moduleDiscordService.getHello();
  }
}
