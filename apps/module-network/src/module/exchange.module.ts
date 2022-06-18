import { Module } from '@nestjs/common';
import { ExchangeController } from '../controller/exchange.controller';
import { ExchangeSvc } from '../service/exchange.service';

@Module({
  imports: [],
  controllers: [ExchangeController],
  providers: [ExchangeSvc],
})
export class ExchangeModule {}
