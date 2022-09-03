import { CallerModule, Method, ModuleCallerSvc } from '@app/core';
import { Exchange } from '@model/network';
import { PlanBuilder } from '@model/plan';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { BrainSvc } from './service/brain.service';

describe('AppController', () => {
  let appController: AppController;
  const moduleCallerMock = {
    callOrderModule: null,
    callBalanceModule: null,
    callPlanModule: null,
    callAsyncModule: null,
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CallerModule],
      controllers: [AppController],
      providers: [
        BrainSvc,
        {
          provide: ModuleCallerSvc,
          useValue: moduleCallerMock,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined"', () => {
      expect(appController).toBeDefined();
    });
  });
  describe('init', () => {
    it('should init', () => {
      moduleCallerMock.callPlanModule = jest.fn();
      moduleCallerMock.callOrderModule = jest.fn();
      moduleCallerMock.callAsyncModule = jest.fn();
      appController.init('planId');
      expect(moduleCallerMock.callPlanModule).toBeCalledWith(Method.POST, 'plans/computeStep/planId', null);
    });
  });
  describe('synchronize', () => {
    it('should increase ceiling the plan', async () => {
      moduleCallerMock.callOrderModule = jest.fn().mockReturnValue([new Exchange()]);
      moduleCallerMock.callBalanceModule = jest.fn();
      moduleCallerMock.callAsyncModule = jest.fn();

      moduleCallerMock.callPlanModule = jest.fn().mockImplementation((method) => {
        if (method === Method.GET) {
          return new PlanBuilder().withPair({ token1: 'AZERO', token2: 'USDT' }).withStepLevels([1, 1.1, 1.21]).build();
        } else if (method === Method.POST) {
          return new PlanBuilder()
            .withPair({ token1: 'AZERO', token2: 'USDT' })
            .withStepLevels([1, 1.1, 1.21, 1.3])
            .build();
        }
      });

      appController.synchronize('planId');
    });
    it('should not increase ceiling the plan', async () => {
      moduleCallerMock.callOrderModule = jest.fn().mockReturnValue([new Exchange()]);
      moduleCallerMock.callBalanceModule = jest.fn();
      moduleCallerMock.callAsyncModule = jest.fn();

      moduleCallerMock.callPlanModule = jest.fn().mockImplementation((method) => {
        if (method === Method.GET) {
          return new PlanBuilder().withPair({ token1: 'AZERO', token2: 'USDT' }).withStepLevels([1, 1.1, 1.21]).build();
        } else if (method === Method.POST) {
          return new PlanBuilder().withPair({ token1: 'AZERO', token2: 'USDT' }).withStepLevels([1, 1.1, 1.21]).build();
        }
      });

      appController.synchronize('planId');
    });
  });
});
