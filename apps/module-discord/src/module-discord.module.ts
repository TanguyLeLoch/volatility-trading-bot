import { Module } from '@nestjs/common';
import { ModuleDiscordController } from './module-discord.controller';
import { ModuleDiscordService } from './module-discord.service';

@Module({
  imports: [],
  controllers: [ModuleDiscordController],
  providers: [ModuleDiscordService],
})
export class ModuleDiscordModule {}
