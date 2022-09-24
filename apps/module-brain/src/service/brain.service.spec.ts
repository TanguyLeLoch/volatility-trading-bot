import { Test, TestingModule } from '@nestjs/testing';
import { BrainSvc } from './brain.service';
import { ModuleCallerSvc } from '@app/core';
import { AsyncCall } from '@model/async';
import { featureFlag } from '@model/common';
import { PlanBuilder } from '@model/plan';
import { Exchange } from '@model/network';

describe('BrainService', () => {
  let brainService: BrainSvc;
  const moduleCallerSvcMock: ModuleCallerSvc = {
    callOrderModule: jest.fn().mockImplementation(() => {
      return [new Exchange()];
    }),
    callAsyncModule: jest.fn().mockImplementation(() => {
      return new AsyncCall();
    }),
    callPlanModule: jest.fn().mockImplementation(() => {
      return new PlanBuilder().withStepLevels([]).build();
    }),
    callBalanceModule: jest.fn().mockImplementation(() => {
      return {};
    }),
  } as any;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [
        BrainSvc,
        {
          provide: ModuleCallerSvc,
          useValue: moduleCallerSvcMock,
        },
      ],
    }).compile();

    brainService = app.get<BrainSvc>(BrainSvc);
  });

  describe('synchronize', () => {
    it('should synchronize the plan', async () => {
      featureFlag.increaseCeiling = true;
      await brainService.synchronize('myPlanId');
      expect(moduleCallerSvcMock.callOrderModule).toHaveBeenCalledWith('post', 'orders/synchronize/myPlanId', null);
      expect(moduleCallerSvcMock.callAsyncModule).toHaveBeenCalledWith('post', 'asyncs', expect.any(AsyncCall));
      expect(moduleCallerSvcMock.callPlanModule).toHaveBeenCalledWith('get', 'plans/myPlanId', null);
      expect(moduleCallerSvcMock.callBalanceModule).toHaveBeenCalledWith('post', 'synchronize/planId/myPlanId', null);
    });
    it('should synchronize without increase the ceiling because of the feature flag', async () => {
      featureFlag.increaseCeiling = false;
      await brainService.synchronize('myPlanId');
      expect(moduleCallerSvcMock.callOrderModule).toHaveBeenCalledWith('post', 'orders/synchronize/myPlanId', null);
      expect(moduleCallerSvcMock.callAsyncModule).toHaveBeenCalledWith('post', 'asyncs', expect.any(AsyncCall));
    });
    it('should synchronize without increase the ceiling because of the override of the feature flag', async () => {
      featureFlag.increaseCeiling = true;
      moduleCallerSvcMock.callPlanModule = jest
        .fn()
        .mockImplementation(() =>
          new PlanBuilder().withStepLevels([]).withFeatureOverride({ increaseCeiling: false }).build(),
        );
      await brainService.synchronize('myPlanId');
      expect(moduleCallerSvcMock.callOrderModule).toHaveBeenCalledWith('post', 'orders/synchronize/myPlanId', null);
      expect(moduleCallerSvcMock.callAsyncModule).toHaveBeenCalledWith('post', 'asyncs', expect.any(AsyncCall));
      expect(moduleCallerSvcMock.callPlanModule).toHaveBeenCalledWith('get', 'plans/myPlanId', null);
    });
  });
});
