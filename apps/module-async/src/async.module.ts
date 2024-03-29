import { ApiMiddleware, CallerModule } from '@app/core';
import { AsyncCallSchema } from '@model/async';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AsyncController } from './async.controller';
import { AsyncEngineSvc } from './async.engine.service';
import { AsyncSvc } from './async.service';
import { PingController } from './ping.controller';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Async', schema: AsyncCallSchema }]),
    ScheduleModule.forRoot(),
    CallerModule,
  ],
  controllers: [AsyncController, PingController],
  providers: [AsyncSvc, AsyncEngineSvc],
})
export class AsyncModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
