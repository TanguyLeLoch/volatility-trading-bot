import { CallerModule } from '@app/core';
import { AsyncCallSchema } from '@model/async';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AsyncController } from './async.controller';
import { AsyncEngineSvc } from './async.engine.service';
import { AsyncSvc } from './async.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Async', schema: AsyncCallSchema }]),
    CallerModule,
  ],
  controllers: [AsyncController],
  providers: [AsyncSvc, AsyncEngineSvc],
})
export class AsyncModule {}
