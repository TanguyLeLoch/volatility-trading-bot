import { Module } from '@nestjs/common';
import { OrderController } from '../controller/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSvc } from '../service/order.service';
import { OrderSchema } from '@model/order';
import { CallerModule } from '@app/core';
import { SyncOrderSvc } from '../service/sync.order.service';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/module-order'),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
    CallerModule,
  ],
  controllers: [OrderController],
  providers: [OrderSvc, SyncOrderSvc],
})
export class OrderModule {}
