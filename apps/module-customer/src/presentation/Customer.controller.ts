import { Body, Controller, Post } from '@nestjs/common';
import { CustomerResponse } from './CustomerResponse';
import { CustomerRequest } from './CustomerRequest';
import winston from 'winston';
import { createCustomLogger } from '@app/core';
import { moduleName } from '../module.info';
import { CustomerService } from '../application/Customer.service';
import { CustomerResource } from '../application/Customer.resource';

@Controller('customers')
export class CustomerController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, CustomerController.name);

  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async createCustomer(@Body() customer: CustomerRequest): Promise<CustomerResponse> {
    const customerResource: CustomerResource = await this.customerService.createCustomer(customer);
    this.logger.info(`Customer created with id: ${customerResource.Id}`);
    return customerResource.toResponse();
  }
}
