import { ApiMiddleware } from '@app/core';
import { CallerModule } from '@app/core/caller/caller.module';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { PingController } from './ping.controller';
import { BrainSvc } from './service/brain.service';

@Module({
  imports: [CallerModule],
  controllers: [AppController, PingController],
  providers: [BrainSvc],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
