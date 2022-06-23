import { CallerModule } from '@app/core';
import { Module } from '@nestjs/common';
import { DexController } from '../controller/dex.controller';
import { MexcSvc } from '../service/mexc.service';
import { DexSvc } from '../service/dex.service';
import { ExchangeModule } from './exchange.module';

@Module({
  imports: [CallerModule, ExchangeModule],
  controllers: [DexController],
  providers: [DexSvc, MexcSvc],
})
export class DexModule {}
