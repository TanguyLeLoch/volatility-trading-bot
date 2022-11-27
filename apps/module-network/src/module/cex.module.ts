import { CallerModule } from '@app/core';
import { Module } from '@nestjs/common';
import { CexController } from '../controller/cex.controller';
import { MexcSvc } from '../service/mexc.service';
import { CexSvc } from '../service/cex.service';
import { ExchangeModule } from './exchange.module';
import { BinanceSvc } from '../service/binance.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PairInfoSchema } from '../PairInfo/pair.info.document';
import { PairInfoRepository } from '../PairInfo/pair.info.repository';

@Module({
  imports: [
    CallerModule,
    ExchangeModule,
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'PairInfo', schema: PairInfoSchema }]),
  ],
  controllers: [CexController],
  providers: [CexSvc, MexcSvc, BinanceSvc, PairInfoRepository],
})
export class CexModule {}
