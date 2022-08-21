import { Method } from '@app/core';
import { BalanceBuilder } from '@model/balance';
import { Pair, RecomputeStepRequest } from '@model/common';
import { Plan, PlanBuilder } from '@model/plan';
import { isCloseToExistingStep, PlanSvc } from './plan.service';

const planMockRepository = {
  findById: jest.fn(),
  findByIdAndUpdate: jest.fn(),
};
const moduleCallerSvcMock = {
  callModule: jest.fn(),
};

describe('PlanSvc', () => {
  const planSvc: PlanSvc = new PlanSvc(planMockRepository as any, moduleCallerSvcMock as any);

  describe('step compute ', () => {
    it('planSvc', () => {
      expect(planSvc).toBeDefined();
    });
    const planId = '1234';
    planMockRepository.findById.mockReturnValue({
      exec: jest.fn(() => {
        const pair = new Pair({ token1: 'AZERO', token2: 'USDT' });
        const plan = new PlanBuilder()
          .withId(planId)
          .withPair(pair)
          .withPlatform('MEXC')
          .withStartAmount(1000)
          .withPriceMin(1)
          .withStep(10)
          .withAmountPerStep(100)
          .withStepLevels([1, 1.1, 1.21, 1.331, 1.464, 1.611, 1.772, 1.949, 2.144, 2.358, 2.594])
          .build();
        return plan;
      }),
    });
    planMockRepository.findByIdAndUpdate.mockImplementation((planId, plan, params) => {
      return { exec: () => plan };
    });
    // return balance
    moduleCallerSvcMock.callModule.mockImplementation((module, method, path, body) => {
      if (module === 'balance' && method === Method.GET) {
        return new BalanceBuilder().withToken('AZERO').withAvailable(100).withPlatform('MEXC').withInOrder(300).build();
      }
    });
    it('should recompute the step with 3 new step', async () => {
      const request: RecomputeStepRequest = {
        module: 'plan',
        name: 'recomputeStep',
        planId,
        pair: { token1: 'AZERO', token2: 'USDT' },
      };

      const planUpdated: Plan = await planSvc.recomputeStep(request);
      expect(planUpdated.stepLevels).toEqual([
        1, 1.1, 1.21, 1.331, 1.464, 1.611, 1.772, 1.949, 2.144, 2.358, 2.594, 2.853, 3.138, 3.452,
      ]);
    });
    it('should recompute the step with 0 new step', async () => {
      // return balance
      moduleCallerSvcMock.callModule.mockImplementation((module, method, path, body) => {
        if (module === 'balance' && method === Method.GET) {
          return new BalanceBuilder()
            .withToken('AZERO')
            .withAvailable(10)
            .withPlatform('MEXC')
            .withInOrder(300)
            .build();
        }
      });
      const request: RecomputeStepRequest = {
        module: 'plan',
        name: 'recomputeStep',
        planId,
        pair: { token1: 'AZERO', token2: 'USDT' },
      };

      const planUpdated: Plan = await planSvc.recomputeStep(request);
      expect(planUpdated.stepLevels).toEqual([1, 1.1, 1.21, 1.331, 1.464, 1.611, 1.772, 1.949, 2.144, 2.358, 2.594]);
    });
  });

  describe('isCloseToExistingStep', () => {
    it('should verify if isCloseToExistingStep', () => {
      expect(isCloseToExistingStep(1.1, [1, 1.1, 1.21, 1.331, 1.464, 1.611])).toBe(true);
      expect(isCloseToExistingStep(1.3311, [1, 1.1, 1.21, 1.331, 1.464, 1.611])).toBe(true);
      expect(isCloseToExistingStep(1.3309, [1, 1.1, 1.21, 1.331, 1.464, 1.611])).toBe(true);
      expect(isCloseToExistingStep(1.3321, [1, 1.1, 1.21, 1.331, 1.464, 1.611])).toBe(false);
      expect(isCloseToExistingStep(1.33, [1, 1.1, 1.21, 1.331, 1.464, 1.611])).toBe(true);
      expect(isCloseToExistingStep(1.333, [1, 1.1, 1.21, 1.331, 1.464, 1.611])).toBe(false);
    });
  });
});
