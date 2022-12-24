import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerController } from './presentation/Customer.controller';
import { ApiMiddleware } from '@app/core';
import { PasswordHasherService } from './application/Password.hasher.service';
import { CustomerService } from './application/Customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerDocument } from './infrastructure/CustomerDocument';
import { PasswordDocument } from './infrastructure/Password.document';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([{ name: 'Customer', schema: CustomerDocument }], 'customers'),
    MongooseModule.forFeature([{ name: 'Password', schema: PasswordDocument }], 'passwords'),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, PasswordHasherService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
