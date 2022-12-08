import { Test, TestingModule } from '@nestjs/testing';
import { ModuleCustomerController } from './module-customer.controller';

describe('ModuleCustomerController', () => {
  let moduleCustomerController: ModuleCustomerController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModuleCustomerController],
      providers: [],
    }).compile();

    moduleCustomerController = app.get<ModuleCustomerController>(ModuleCustomerController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(moduleCustomerController).toBeDefined();
    });
  });
});
