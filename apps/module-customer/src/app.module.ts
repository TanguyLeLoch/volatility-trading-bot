import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerController } from './presentation/Customer.controller';
import { ApiMiddleware } from '@app/core';
import { PasswordHasherService } from './application/Password.hasher.service';
import { CustomerService } from './application/Customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './infrastructure/CustomerDocument';
import { PasswordSchema } from './infrastructure/Password.document';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Password', schema: PasswordSchema },
    ]),
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
