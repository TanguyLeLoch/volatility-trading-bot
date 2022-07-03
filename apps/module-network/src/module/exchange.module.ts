import { ExchangeSchema } from '@model/network';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeController } from '../controller/exchange.controller';
import { ExchangeSvc } from '../service/exchange.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Exchange', schema: ExchangeSchema }]),
  ],
  controllers: [ExchangeController],
  providers: [ExchangeSvc],
  exports: [ExchangeSvc],
})
export class ExchangeModule {}
