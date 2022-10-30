import { ModuleCallerSvc } from '@app/core';
import { OrderSvc } from './order.service';
import { SyncOrderCheckSvc } from './sync.order.check.service';
import { SyncOrderSvc } from './sync.order.service';
import { Exchange } from '@model/network';
import { dumbOrdersCex, dumbOrdersDb, dumbPlan } from '../../test/testHelper';
import { Order, OrderStatus } from '@model/order';

describe('SyncOrderSvc', () => {
  let syncOrderSvc: SyncOrderSvc;
  let orderSvcMock: OrderSvc;
  const syncOrderCheckSvcMock: SyncOrderCheckSvc = new SyncOrderCheckSvc();
  let moduleCallerSvcMock: ModuleCallerSvc;

  beforeEach(() => {
    orderSvcMock = {} as any;
    moduleCallerSvcMock = {} as any;
    syncOrderSvc = new SyncOrderSvc(orderSvcMock, moduleCallerSvcMock, syncOrderCheckSvcMock);
    moduleCallerSvcMock.postMessageWithParamsOnDiscord = jest.fn();
  });
  it('should be defined', () => {
    expect(syncOrderSvc).toBeDefined();
  });
  describe('synchronize', () => {
    it('should synchronize without any change', async () => {
      orderSvcMock.findByPlanId = jest.fn().mockResolvedValue(dumbOrdersDb());
      moduleCallerSvcMock.callPlanModule = jest.fn().mockResolvedValue(dumbPlan);
      moduleCallerSvcMock.callNetworkModule = jest.fn().mockResolvedValue(dumbOrdersCex());
      const exchanges: Exchange[] = await syncOrderSvc.synchronize('planId');
      expect(exchanges).toEqual([]);
    });
    it('should synchronize with one change', async () => {
      const dumbOrdersCexWithChange = dumbOrdersCex().filter((order) => order.price.value !== 19546.736);
      const dumbOrdersDbInit = dumbOrdersDb();

      orderSvcMock.findByPlanId = jest
        .fn()
        .mockResolvedValue(dumbOrdersDbInit)
        .mockImplementationOnce(() => {
          return dumbOrdersDbInit.filter((order: Order) =>
            [OrderStatus.NEW, OrderStatus.PARTIALLY_FILLED].includes(order.status),
          );
        });
      moduleCallerSvcMock.callPlanModule = jest.fn().mockResolvedValue(dumbPlan);
      moduleCallerSvcMock.callNetworkModule = jest
        .fn()
        .mockResolvedValueOnce(dumbOrdersCexWithChange)
        .mockImplementationOnce(() => {
          const order: Order = dumbOrdersCex().find((order) => order.price.value === 19546.736);
          order.status = OrderStatus.FILLED;
          return order;
        })
        .mockReturnValueOnce([new Exchange()]);
      orderSvcMock.markAsFilled = jest.fn().mockImplementation((order: Order) => {
        order.status = OrderStatus.FILLED;
        return order;
      });
      orderSvcMock.create = jest.fn().mockImplementation((order: Order) => order);

      const exchanges: Exchange[] = await syncOrderSvc.synchronize('planId');
      expect(exchanges).toHaveLength(1);
    });
  });
});
