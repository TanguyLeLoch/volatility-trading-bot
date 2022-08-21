import { ApiMiddleware, CallerModule } from '@app/core';
import { BalanceSchema } from '@model/balance';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceController } from './controller/balance.controller';
import { SynchronizeController } from './controller/synchronize.controller';
import { PingController } from './ping.controller';
import { BalanceSvc } from './service/balance.service';
import { SynchronizeSvc } from './service/synchronize.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Balance', schema: BalanceSchema }]),
    CallerModule,
  ],
  controllers: [PingController, BalanceController, SynchronizeController],
  providers: [BalanceSvc, SynchronizeSvc],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
