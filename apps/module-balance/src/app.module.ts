import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { PingController } from './ping.controller';
import { BalanceController } from './controller/balance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceSvc } from './service/balance.service';
import { BalanceSchema } from '@model/balance';
import { ApiMiddleware } from '@app/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Balance', schema: BalanceSchema }]),
  ],
  controllers: [PingController, BalanceController],
  providers: [BalanceSvc],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
