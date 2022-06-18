import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BalanceController } from './controller/balance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceSvc } from './service/balance.service';
import { BalanceSchema } from 'module-balance-model';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/module-balance'),
    MongooseModule.forFeature([{ name: 'Balance', schema: BalanceSchema }]),
  ],
  controllers: [AppController, BalanceController],
  providers: [BalanceSvc],
})
export class AppModule {}
