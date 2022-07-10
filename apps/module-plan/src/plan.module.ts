import { CallerModule } from '@app/core';
import { PlanSchema } from '@model/plan';
import { Module } from '@nestjs/common';
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
export class PlanModule {}
