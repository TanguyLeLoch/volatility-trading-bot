import { CallerModule } from '@app/core';
import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { BrainSvc } from './service/brain.service';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CallerModule],
      controllers: [AppController],
      providers: [BrainSvc],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should be defined"', () => {
      expect(appController).toBeDefined();
    });
  });
});
