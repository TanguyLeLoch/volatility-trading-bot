import { Test, TestingModule } from '@nestjs/testing';
import { SyncController } from './sync.controller';
import { SyncSvc } from '../service/sync.service';

describe('SyncController', () => {
  let appController: SyncController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [SyncController],
      providers: [SyncSvc],
    }).compile();

    appController = app.get<SyncController>(SyncController);
  });

  // describe('root', () => {
  //   it('should return "Hello World!"', () => {
  //     expect(appController.sync()).toBe('Hello World!');
  //   });
  // });
});
