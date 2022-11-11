import { Controller, Get } from '@nestjs/common';
import { ModuleCustomerService } from './module-customer.service';

@Controller()
export class ModuleCustomerController {
  constructor(private readonly moduleCustomerService: ModuleCustomerService) {}

  @Get()
  getHello(): string {
    return this.moduleCustomerService.getHello();
  }
}
