import { CallerModule } from '@app/core';
import { OrderSchema } from '@model/order';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderController } from '../controller/order.controller';
import { OrderSvc } from '../service/order.service';
import { SyncOrderCheckSvc } from '../service/sync.order.check.service';
import { SyncOrderSvc } from '../service/sync.order.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    CallerModule,
  ],
  controllers: [OrderController],
  providers: [OrderSvc, SyncOrderSvc, SyncOrderCheckSvc],
})
export class OrderModule {}
