import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StubCexController } from './stub.cex.controller';
import { StubCexSvc } from './stub.cex.svc';
import { CexBalanceSchema, CexOrderSchema } from '@model/network';
import { CallerModule } from '@app/core';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot-stub'),
    MongooseModule.forFeature([{ name: 'CexOrder', schema: CexOrderSchema }]),
    MongooseModule.forFeature([{ name: 'CexBalance', schema: CexBalanceSchema }]),
    CallerModule,
  ],
  controllers: [StubCexController],
  providers: [StubCexSvc],
})
export class StubModule {}
