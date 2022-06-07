import { Test, TestingModule } from '@nestjs/testing';
import { BalanceController } from './balance.controller';
import { BalanceService } from '../service/balance.service';

const mockBalanceService = {
  findAll: jest.fn(),
};

describe('AppController', () => {
  let balanceController: BalanceController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [BalanceController],
      providers: [
        {
          provide: BalanceService,
          useValue: mockBalanceService,
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
      expect(mockBalanceService.findAll).toHaveBeenCalled();
    });
  });
});
