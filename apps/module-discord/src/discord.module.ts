import { CallerModule } from '@app/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { PingController } from './ping.controller';

@Module({
  imports: [ConfigModule.forRoot(), CallerModule],
  controllers: [DiscordController, PingController],
  providers: [DiscordService],
})
export class DiscordModule {}
