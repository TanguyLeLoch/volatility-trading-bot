import { Test, TestingModule } from '@nestjs/testing';
import { CexController } from './cex.controller';
import { CexSvc } from '../service/cex.service';
import { CallerModule } from '@app/core';
import { MexcSvc } from '../service/mexc.service';
import { ExchangeSvc } from '../service/exchange.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeSchema } from '@model/network';

describe('CexController', () => {
  let cexController: CexController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CallerModule,
        MongooseModule.forRoot('mongodb://localhost/test-module-network'),
        MongooseModule.forFeature([{ name: 'Exchange', schema: ExchangeSchema }]),
      ],
      controllers: [CexController],
      providers: [CexSvc, MexcSvc, ExchangeSvc],
    }).compile();

    cexController = app.get<CexController>(CexController);
  });

  describe('cexController', () => {
    it('should be defined', () => {
      expect(cexController).toBeDefined();
    });
  });
});
