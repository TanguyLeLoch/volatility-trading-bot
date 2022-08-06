import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { BalanceSvc } from '../service/balance.service';
import { BalanceController } from './balance.controller';

const balanceMockRepository = {
  find: jest.fn(() => {
    return {
      exec: jest.fn(),
    };
  }),
};

describe('AppController', () => {
  let balanceController: BalanceController;
  let balanceSvc: BalanceSvc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        BalanceSvc,
        {
          provide: getModelToken('Balance'),
          useValue: balanceMockRepository,
        },
      ],
    }).compile();

    balanceController = module.get<BalanceController>(BalanceController);
    balanceSvc = module.get<BalanceSvc>(BalanceSvc);
  });
  it('should be defined', () => {
    expect(balanceController).toBeDefined();
    expect(balanceSvc).toBeDefined();
  });
  describe('get balances', () => {
    it('should return a list of balance', () => {
      balanceController.getBalances();
      expect(balanceMockRepository.find).toHaveBeenCalled();
    });
  });
});
