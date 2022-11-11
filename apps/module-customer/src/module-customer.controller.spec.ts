import { Test, TestingModule } from '@nestjs/testing';
import { ModuleCustomerController } from './module-customer.controller';
import { ModuleCustomerService } from './module-customer.service';

describe('ModuleCustomerController', () => {
  let moduleCustomerController: ModuleCustomerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModuleCustomerController],
      providers: [ModuleCustomerService],
    }).compile();

    moduleCustomerController = app.get<ModuleCustomerController>(ModuleCustomerController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(moduleCustomerController.getHello()).toBe('Hello World!');
    });
  });
});
