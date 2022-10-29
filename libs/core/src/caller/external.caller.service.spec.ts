import { Utils } from '@model/common';
import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { Method } from '../method';
import { ExternalCallerSvc } from '@app/core';
import { ExternalCallback } from '@app/core/caller/external.callback';

describe('ExternalCallerSvc', () => {
  let service: ExternalCallerSvc;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [HttpModule],
      providers: [ExternalCallerSvc],
    }).compile();

    service = module.get<ExternalCallerSvc>(ExternalCallerSvc);

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
        .mockImplementationOnce(() => throwErrorAtStatus(400))
        .mockReturnValue({ myObject: 'myObject' });
      const callbacks = new ExternalCallback(3);
      callbacks.addCallback(
        400,
        async () =>
          await service.callExternal(Method.GET, 'http://localhost:3000/callMexc', undefined, undefined, callbacks),
      );

      const response = await service.callExternal(
        Method.GET,
        'http://localhost:3000/callMexc',
        undefined,
        undefined,
        callbacks,
      );
      expect(response).toEqual({ myObject: 'myObject' });
    });
    it('should throw error because of status', async () => {
      service.callOnce = jest.fn().mockImplementationOnce(() => throwErrorAtStatus(429));
      const callbacks = new ExternalCallback(3);
      callbacks.addCallback(
        400,
        async () =>
          await service.callExternal(Method.GET, 'http://localhost:3000/callMexc', undefined, undefined, callbacks),
      );
      await expect(
        async () =>
          await service.callExternal(Method.GET, 'http://localhost:3000/callMexc', undefined, undefined, callbacks),
      ).rejects.toThrow('429_NOT_RETRYABLE');
    });
    it('should throw error be cause no more retry', async () => {
      service.callOnce = jest.fn(() => throwErrorAtStatus(400));
      const callbacks = new ExternalCallback(3);
      callbacks.addCallback(
        400,
        async () =>
          await service.callExternal(Method.GET, 'http://localhost:3000/callMexc', undefined, undefined, callbacks),
      );
      await expect(
        async () =>
          await service.callExternal(Method.GET, 'http://localhost:3000/callMexc', undefined, undefined, callbacks),
      ).rejects.toThrow(Error('NO_MORE_RETRY'));
    });
  });
});
