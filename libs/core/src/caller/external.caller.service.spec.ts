import { Utils } from '@model/common';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Method } from '../method';
import { ExternalCallerSvc } from '@app/core';

describe('ExternalCallerSvc', () => {
  let service: ExternalCallerSvc;
  let loggerMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExternalCallerSvc],
    }).compile();

    service = module.get<ExternalCallerSvc>(ExternalCallerSvc);
    loggerMock = {
      debug: jest.fn(),
      error: jest.fn(),
    };
    Reflect.set(service, 'logger', loggerMock);

    Utils.sleep = jest.fn(() => Promise.resolve());
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('callExternal', () => {
    const throwErrorAtStatus = (status: number): never => {
      const error = new Error() as any;
      error.status = status;
      throw error;
    };
    it('should retry call', async () => {
      service.callOnce = jest
        .fn()
        .mockImplementationOnce(() => throwErrorAtStatus(504))
        .mockReturnValue({ myObject: 'myObject' });

      const response = await service.callExternal(Method.GET, 'http://localhost:3000/callMexc');
      expect(response).toEqual({ myObject: 'myObject' });
    });
    it('should throw error because of 400 status', async () => {
      service.callOnce = jest.fn().mockImplementationOnce(() => throwErrorAtStatus(400));

      await expect(
        async () => await service.callExternal(Method.GET, 'http://localhost:3000/callMexc'),
      ).rejects.toThrow('400_NOT_RETRYABLE');
    });
    it('should throw error be cause no more retry', async () => {
      service.callOnce = jest.fn(() => throwErrorAtStatus(504));
      await expect(
        async () => await service.callExternal(Method.GET, 'http://localhost:3000/callMexc'),
      ).rejects.toThrow(Error('NO_MORE_RETRY'));
    });
  });
});
