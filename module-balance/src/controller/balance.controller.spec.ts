import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';

describe('AppController', () => {
  let balanceController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
    }).compile();

    balanceController = app.get<BalanceController>(BalanceController);
  });
  it('should be defined', () => {
    expect(balanceController).toBeDefined();
  });
  describe('get balances', () => {
    it('should return a list of balance"', () => {
      const balances = balanceController.getBalances();
      expect(balances.length).toBeGreaterThan(0);
    });
  });
});
