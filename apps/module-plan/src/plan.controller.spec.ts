import { Test, TestingModule } from '@nestjs/testing';
import { PlanController } from './plan.controller';
import { PlanSvc } from './plan.service';

describe('ModulePlanController', () => {
  let modulePlanController: PlanController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PlanController],
      providers: [PlanSvc],
    }).compile();

    modulePlanController = app.get<PlanController>(PlanController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(modulePlanController.getPlanById({ id: '123' })).toBe({});
    });
  });
});
