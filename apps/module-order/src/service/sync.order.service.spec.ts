import { ModuleCallerSvc } from '@app/core';
import { OrderSvc } from './order.service';
import { SyncOrderCheckSvc } from './sync.order.check.service';
import { SyncOrderSvc } from './sync.order.service';

jest.mock('@app/core', () => {
  const originalModule = jest.requireActual('@app/core');

  return {
    __esModule: true,
    ...originalModule,
    createCustomLogger: jest.fn(),
  };
});

describe('SyncOrderSvc', () => {
  let syncOrderSvc: SyncOrderSvc;
  let orderSvcMock: OrderSvc;
  let syncOrderCheckSvcMock: SyncOrderCheckSvc;
  let moduleCallerSvcMock: ModuleCallerSvc;

  beforeEach(() => {
    orderSvcMock = {} as any;
    moduleCallerSvcMock = {} as any;
    syncOrderCheckSvcMock = {} as any;

    syncOrderSvc = new SyncOrderSvc(orderSvcMock, moduleCallerSvcMock, syncOrderCheckSvcMock);
  });
  it('should be defined', () => {
    expect(syncOrderSvc).toBeDefined();
  });
});
