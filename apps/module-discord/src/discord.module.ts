import { ApiMiddleware, CallerModule } from '@app/core';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';
import { PingController } from './ping.controller';

@Module({
  imports: [ConfigModule.forRoot(), CallerModule],
  controllers: [DiscordController, PingController],
  providers: [DiscordService],
})
export class DiscordModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
