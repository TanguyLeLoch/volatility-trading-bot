import { MexcBalanceSchema } from '@model/balance';
import { MexcOrderSchema } from '@model/order';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StubMexcController } from './stub.mexc.controller';
import { StubMexcSvc } from './stub.mexc.svc';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot-stub'),
    MongooseModule.forFeature([{ name: 'MexcOrder', schema: MexcOrderSchema }]),
    MongooseModule.forFeature([{ name: 'MexcBalance', schema: MexcBalanceSchema }]),
  ],
  controllers: [StubMexcController],
  providers: [StubMexcSvc],
})
export class StubModule {}
