import { AsyncCallSchema } from '@model/async';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AsyncController } from './async.controller';
import { AsyncSvc } from './async.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/module-async'),
    MongooseModule.forFeature([{ name: 'Async', schema: AsyncCallSchema }]),
  ],
  controllers: [AsyncController],
  providers: [AsyncSvc],
})
export class AsyncModule {}
