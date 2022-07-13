import { ExchangeSchema } from '@model/network';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeSvc } from '../service/exchange.service';
import { ExchangeController } from './exchange.controller';

describe('ExchangeController', () => {
  let exchangeController: ExchangeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test-module-network'),
        MongooseModule.forFeature([{ name: 'Exchange', schema: ExchangeSchema }]),
      ],
      controllers: [ExchangeController],
      providers: [ExchangeSvc],
    }).compile();

    exchangeController = app.get<ExchangeController>(ExchangeController);
  });

  describe('ExchangeController', () => {
    it('should be defined', () => {
      expect(exchangeController).toBeDefined();
    });
  });
});
