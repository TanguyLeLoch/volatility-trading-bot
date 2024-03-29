import { Test, TestingModule } from '@nestjs/testing';
import { PingController } from './ping.controller';

describe('AppController', () => {
  let appController: PingController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [PingController],
      providers: [],
    }).compile();

    appController = app.get<PingController>(PingController);
  });

  describe('root', () => {
    it('should return "pong"', () => {
      expect(appController.Ping()).toBe('pong');
    });
  });
});
