import { Test, TestingModule } from '@nestjs/testing';
import { DexController } from './dex.controller';
import { DexSvc } from '../service/dex.service';

describe('DexController', () => {
  let appController: DexController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [DexController],
      providers: [DexSvc],
    }).compile();

    appController = app.get<DexController>(DexController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.dex()).toBe('Hello World!');
  //   });
  // });
});
