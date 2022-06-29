import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeController } from './exchange.controller';
import { ExchangeSvc } from '../service/exchange.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeSchema } from '@model/network';

describe('ExchangeController', () => {
  let exchangeController: ExchangeController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test-module-network'),
        MongooseModule.forFeature([
          { name: 'Exchange', schema: ExchangeSchema },
        ]),
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
