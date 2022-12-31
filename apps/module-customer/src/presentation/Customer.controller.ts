import { Body, Controller, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CustomerResponse } from './CustomerResponse';
import { CustomerRequest } from './CustomerRequest';
import winston from 'winston';
import { createCustomLogger } from '@app/core';
import { moduleName } from '../module.info';
import { CustomerService } from '../application/Customer.service';
import { CustomerResource } from '../application/Customer.resource';
import { LoginRequest } from './LoginRequest';
import { AuthService } from '../application/Auth.service';

@Controller('customers')
export class CustomerController {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, CustomerController.name);

  constructor(private readonly customerService: CustomerService, private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async createCustomer(@Body() customer: CustomerRequest): Promise<CustomerResponse> {
    const customerResource: CustomerResource = await this.customerService.createCustomer(customer);
    this.logger.info(`Customer created with id: ${customerResource.id}`);
    return customerResource.toResponse();
  }

  @Post('login')
  @UsePipes(new ValidationPipe())
  async loginCustomer(@Body() request: LoginRequest): Promise<{ token: string }> {
    const jwt: string = await this.authService.login(request);
    this.logger.info(`JWT created for customer with email: ${request.email}`);
    return { token: jwt };
  }
}
