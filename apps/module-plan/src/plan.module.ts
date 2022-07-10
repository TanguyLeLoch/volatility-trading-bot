import { ApiMiddleware, CallerModule } from '@app/core';
import { PlanSchema } from '@model/plan';
import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PingController } from './ping.controller';
import { PlanController } from './plan.controller';
import { PlanSvc } from './plan.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Plan', schema: PlanSchema }]),
    CallerModule,
  ],
  controllers: [PlanController, PingController],
  providers: [PlanSvc],
})
export class PlanModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
