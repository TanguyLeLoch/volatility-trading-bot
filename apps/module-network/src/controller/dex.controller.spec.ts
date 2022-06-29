import { Test, TestingModule } from '@nestjs/testing';
import { DexController } from './dex.controller';
import { DexSvc } from '../service/dex.service';
import { CallerModule } from '@app/core';
import { MexcSvc } from '../service/mexc.service';
import { ExchangeSvc } from '../service/exchange.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ExchangeSchema } from '@model/network';

describe('DexController', () => {
  let dexController: DexController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        CallerModule,
        MongooseModule.forRoot('mongodb://localhost/test-module-network'),
        MongooseModule.forFeature([
          { name: 'Exchange', schema: ExchangeSchema },
        ]),
      ],
      controllers: [DexController],
      providers: [DexSvc, MexcSvc, ExchangeSvc],
    }).compile();

    dexController = app.get<DexController>(DexController);
  });

  describe('dexController', () => {
    it('should be defined', () => {
      expect(dexController).toBeDefined();
    });
  });
});
