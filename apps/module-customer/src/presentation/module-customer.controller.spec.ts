import { Test, TestingModule } from '@nestjs/testing';
import { CustomerController } from './Customer.controller';
import { CustomerRequest } from './CustomerRequest';
import { CustomerService } from '../application/Customer.service';
import { PasswordHasherService } from '../application/Password.hasher.service';

describe('ModuleCustomerController', () => {
  let moduleCustomerController: CustomerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [CustomerService, PasswordHasherService],
    }).compile();

    moduleCustomerController = app.get<CustomerController>(CustomerController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(moduleCustomerController).toBeDefined();
    });
    it('should create a customer', () => {
      const customerRequest: CustomerRequest = new CustomerRequest('Sam', 'bankman@fried.com', '123Soleil');

      expect(moduleCustomerController.createCustomer(customerRequest)).toBe('createCustomer');
    });
  });
});
