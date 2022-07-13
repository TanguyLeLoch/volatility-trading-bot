import { CallerModule } from '@app/core';
import { ExchangeSchema } from '@model/network';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { ExchangeModule } from '../module/exchange.module';
import { CexSvc } from '../service/cex.service';
import { ExchangeSvc } from '../service/exchange.service';
import { MexcSvc } from '../service/mexc.service';
import { CexController } from './cex.controller';

describe('CexController', () => {
  let cexController: CexController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CallerModule,
        ExchangeModule,
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
