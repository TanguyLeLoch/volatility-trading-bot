import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { CustomerController } from './presentation/Customer.controller';
import { ApiMiddleware } from '@app/core';
import { CustomerService } from './application/Customer.service';
import { MongooseModule } from '@nestjs/mongoose';
import { CustomerSchema } from './infrastructure/CustomerDocument';
import { PasswordSchema } from './infrastructure/Password.document';
import { AuthService } from './application/Auth.service';
import { JwtModule } from '@nestjs/jwt';
import * as process from 'process';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/grid-trading-bot'),
    MongooseModule.forFeature([
      { name: 'Customer', schema: CustomerSchema },
      { name: 'Password', schema: PasswordSchema },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '600s' },
    }),
  ],
  controllers: [CustomerController],
  providers: [CustomerService, AuthService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
