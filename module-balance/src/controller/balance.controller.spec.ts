import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceSvc } from '../service/balance.service';

const mockBalanceSvc = {
  findAll: jest.fn(),
};

describe('AppController', () => {
  let balanceController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceSvc,
          useValue: mockBalanceSvc,
        },
      ],
    }).compile();

    balanceController = app.get<BalanceController>(BalanceController);
  });
  it('should be defined', () => {
    expect(balanceController).toBeDefined();
  });
  describe('get balances', () => {
    it('should return a list of balance', () => {
      balanceController.getBalances();
      expect(mockBalanceSvc.findAll).toHaveBeenCalled();
    });
  });
});
