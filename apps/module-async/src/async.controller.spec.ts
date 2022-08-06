import { AsyncCall } from '@model/async';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { AsyncController } from './async.controller';
import { AsyncSvc } from './async.service';

describe('ModuleAsyncController', () => {
  let asyncController: AsyncController;
  let asyncSvc: AsyncSvc;
  const asyncCallMockRepository = {
    findById: jest.fn().mockImplementation((id: string) => {
      return {
        exec: jest.fn(() => {
          const asyncMock = new AsyncCall();
          asyncMock._id = id;
          return asyncMock;
        }),
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AsyncController],
      providers: [
        AsyncSvc,
        {
          provide: getModelToken('Async'),
          useValue: asyncCallMockRepository,
        },
      ],
    }).compile();

    asyncController = module.get<AsyncController>(AsyncController);
    asyncSvc = module.get<AsyncSvc>(AsyncSvc);
  });

  describe('root', () => {
    it('should verify that controller and service are up', () => {
      expect(asyncController).toBeDefined();
      expect(asyncSvc).toBeDefined();
    });
    it('should verify the call of find by id', async () => {
      const asyncFound: AsyncCall = await asyncController.getAsyncById({ id: '1234' });
      expect(asyncFound._id).toBe('1234');
      expect(asyncCallMockRepository.findById).toBeCalledWith('1234');
    });
  });
});
