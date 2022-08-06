import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeSvc } from '../service/exchange.service';
import { ExchangeController } from './exchange.controller';

describe('ExchangeController', () => {
  let exchangeController: ExchangeController;
  const exchangeMockRepository = {
    findById: jest.fn().mockImplementation(() => {
      return {
        exec: jest.fn(() => this),
      };
    }),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [ExchangeController],
      providers: [
        ExchangeSvc,
        {
          provide: getModelToken('Exchange'),
          useValue: exchangeMockRepository,
        },
      ],
    }).compile();

    exchangeController = app.get<ExchangeController>(ExchangeController);
  });

  describe('ExchangeController', () => {
    it('should be defined', () => {
      expect(exchangeController).toBeDefined();
    });
  });
});
