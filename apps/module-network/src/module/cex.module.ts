import { CallerModule } from '@app/core';
import { Module } from '@nestjs/common';
import { CexController } from '../controller/cex.controller';
import { MexcSvc } from '../service/mexc.service';
import { CexSvc } from '../service/cex.service';
import { ExchangeModule } from './exchange.module';

@Module({
  imports: [CallerModule, ExchangeModule],
  controllers: [CexController],
  providers: [CexSvc, MexcSvc],
})
export class CexModule {}
