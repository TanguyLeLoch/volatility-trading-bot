import { Test, TestingModule } from '@nestjs/testing';
import { BrainSvc } from './brain.service';
import { ModuleCallerSvc } from '@app/core';
import { AsyncCall } from '@model/async';
import { featureFlag, Pair } from '@model/common';
import { PlanBuilder } from '@model/plan';
import { DiscordMessage, DiscordMessageType } from '@model/discord';
import { Exchange } from '@model/network';

describe('BrainService', () => {
  let brainService: BrainSvc;
  const moduleCallerSvcMock: ModuleCallerSvc = {} as any;
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
    beforeEach(() => {
      // reinit
      moduleCallerSvcMock.callOrderModule = null;
      moduleCallerSvcMock.callAsyncModule = null;
      moduleCallerSvcMock.callPlanModule = null;
      moduleCallerSvcMock.callDiscordModule = null;
      moduleCallerSvcMock.callBalanceModule = null;
    });
    it('should synchronize the plan', async () => {
      const pair: Pair = new Pair({ token1: 'BTC', token2: 'USDT' });
      featureFlag.increaseCeiling = true;
      moduleCallerSvcMock.callOrderModule = jest.fn().mockReturnValueOnce([new Exchange()]);
      moduleCallerSvcMock.callPlanModule = jest
        .fn()
        .mockReturnValueOnce(new PlanBuilder().withStepLevels([1, 2, 3]).build())
        .mockReturnValueOnce(new PlanBuilder().withStepLevels([1, 2, 3, 4, 5]).withPair(pair).build());
      moduleCallerSvcMock.callBalanceModule = jest.fn();
      moduleCallerSvcMock.callAsyncModule = jest.fn();
      moduleCallerSvcMock.postMessageWithParamsOnDiscord = jest.fn();

      await brainService.synchronize('myPlanId');
      expect(moduleCallerSvcMock.callOrderModule).toHaveBeenCalledWith('post', 'orders/synchronize/myPlanId', null);
      expect(moduleCallerSvcMock.callAsyncModule).toHaveBeenCalledWith('post', 'asyncs', expect.any(AsyncCall));
      expect(moduleCallerSvcMock.callPlanModule).toHaveBeenCalledWith('get', 'plans/myPlanId', null);
      expect(moduleCallerSvcMock.callBalanceModule).toHaveBeenCalledWith('post', 'synchronize/planId/myPlanId', null);
      expect(moduleCallerSvcMock.postMessageWithParamsOnDiscord).toHaveBeenCalledWith({
        type: DiscordMessageType.INCREASE_CEILING,
        params: {
          newSteps: [4, 5],
          pair,
        },
      } as DiscordMessage);
    });
    it('should synchronize without increase the ceiling because of the feature flag', async () => {
      featureFlag.increaseCeiling = false;
      moduleCallerSvcMock.callOrderModule = jest.fn().mockReturnValueOnce([new Exchange()]);
      moduleCallerSvcMock.callAsyncModule = jest.fn();

      await brainService.synchronize('myPlanId');
      expect(moduleCallerSvcMock.callOrderModule).toHaveBeenCalledWith('post', 'orders/synchronize/myPlanId', null);
      expect(moduleCallerSvcMock.callAsyncModule).toHaveBeenCalledWith('post', 'asyncs', expect.any(AsyncCall));
    });
    it('should synchronize without increase the ceiling because of the override of the feature flag', async () => {
      featureFlag.increaseCeiling = true;
      moduleCallerSvcMock.callOrderModule = jest.fn().mockReturnValueOnce([new Exchange()]);
      moduleCallerSvcMock.callAsyncModule = jest.fn();
      moduleCallerSvcMock.callPlanModule = jest
        .fn()
        .mockReturnValueOnce(
          new PlanBuilder().withStepLevels([]).withFeatureOverride({ increaseCeiling: false }).build(),
        );
      moduleCallerSvcMock.callBalanceModule = jest.fn();
      await brainService.synchronize('myPlanId');
      expect(moduleCallerSvcMock.callOrderModule).toHaveBeenCalledWith('post', 'orders/synchronize/myPlanId', null);
      expect(moduleCallerSvcMock.callAsyncModule).toHaveBeenCalledWith('post', 'asyncs', expect.any(AsyncCall));
      expect(moduleCallerSvcMock.callPlanModule).toHaveBeenCalledWith('get', 'plans/myPlanId', null);
      expect(moduleCallerSvcMock.callBalanceModule).not.toHaveBeenCalled();
    });
  });
});
