import { CallerModule } from '@app/core';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CexSvc } from '../service/cex.service';
import { ExchangeSvc } from '../service/exchange.service';
import { MexcSvc } from '../service/mexc.service';
import { CexController } from './cex.controller';
import { BinanceSvc } from '../service/binance.service';

describe('CexController', () => {
  let cexController: CexController;
  const exchangeMockRepository = {
    findById: jest.fn().mockImplementation(() => {
      return {
        exec: jest.fn(() => this),
      };
    }),
  };
  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CallerModule],
      controllers: [CexController],
      providers: [
        CexSvc,
        MexcSvc,
        BinanceSvc,
        ExchangeSvc,
        {
          provide: getModelToken('Exchange'),
          useValue: exchangeMockRepository,
        },
      ],
    }).compile();

    cexController = app.get<CexController>(CexController);
  });

  describe('cexController', () => {
    it('should be defined', () => {
      expect(cexController).toBeDefined();
    });
  });
});
