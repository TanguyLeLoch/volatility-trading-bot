import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { OrderController } from './controller/order.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { OrderSvc } from './service/order.service';
import { OrderSchema } from 'module-order-model/order';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/module-order'),
    MongooseModule.forFeature([{ name: 'Order', schema: OrderSchema }]),
  ],
  controllers: [AppController, OrderController],
  providers: [OrderSvc],
})
export class AppModule {}
