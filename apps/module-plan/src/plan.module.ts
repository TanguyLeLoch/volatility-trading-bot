import { CallerModule } from '@app/core';
import { PlanSchema } from '@model/plan';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlanController } from './plan.controller';
import { PlanSvc } from './plan.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Plan', schema: PlanSchema }]),
    CallerModule,
  ],
  controllers: [PlanController],
  providers: [PlanSvc],
})
export class PlanModule {}
