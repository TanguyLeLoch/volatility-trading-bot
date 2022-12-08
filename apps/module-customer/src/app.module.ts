import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ModuleCustomerController } from './presentation/module-customer.controller';
import { ApiMiddleware } from '@app/core';

@Module({
  imports: [],
  controllers: [ModuleCustomerController],
  providers: [],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
