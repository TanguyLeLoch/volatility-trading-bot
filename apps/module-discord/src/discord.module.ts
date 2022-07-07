import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [DiscordController],
  providers: [DiscordService],
})
export class DiscordModule {}
