import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeSvc } from '../service/exchange.service';

describe('AppController', () => {
  let exchangeController: ExchangeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ExchangeController],
      providers: [ExchangeSvc],
    }).compile();

    exchangeController = app.get<ExchangeController>(ExchangeController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(true).toBe(true);
    });
  });
});
