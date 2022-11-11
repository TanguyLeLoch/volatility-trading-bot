import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ModuleCustomerController } from './module-customer.controller';
import { ModuleCustomerService } from './module-customer.service';
import { ApiMiddleware } from '@app/core';

@Module({
  imports: [],
  controllers: [ModuleCustomerController],
  providers: [ModuleCustomerService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(ApiMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
