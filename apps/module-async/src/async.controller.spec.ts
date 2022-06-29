import { AsyncCallSchema } from '@model/async';
import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AsyncController } from './async.controller';
import { AsyncSvc } from './async.service';

describe('ModuleAsyncController', () => {
  let asyncController: AsyncController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forRoot('mongodb://localhost/test-module-async'),
        MongooseModule.forFeature([{ name: 'Async', schema: AsyncCallSchema }]),
      ],
      controllers: [AsyncController],
      providers: [AsyncSvc],
    }).compile();

    asyncController = app.get<AsyncController>(AsyncController);
  });

  describe('root', () => {
    it('should verify the launch of the AsyncController', () => {
      expect(asyncController).toBeDefined();
    });
  });
});
