import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BalanceController } from './controller/balance.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { BalanceService } from './service/balance.service';
import { BalanceSchema } from './model/balance';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/module-balance'),
    MongooseModule.forFeature([{ name: 'Balance', schema: BalanceSchema }]),
  ],
  controllers: [AppController, BalanceController],
  providers: [BalanceService],
})
export class AppModule {}
