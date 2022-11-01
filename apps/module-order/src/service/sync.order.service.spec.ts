import { ModuleCallerSvc } from '@app/core';
import { OrderSvc } from './order.service';
import { SyncOrderCheckSvc } from './sync.order.check.service';
import { SyncOrderSvc } from './sync.order.service';
import { Exchange } from '@model/network';
import { dumbOrdersCex, dumbOrdersDb, dumbPlan } from '../../test/testHelper';
import { Order, OrderBuilder, OrderStatus, PriceType, Side } from '@model/order';

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
        .mockResolvedValueOnce(dumbOrdersDbInit)
        .mockResolvedValueOnce(dumbOrdersDbInit.filter((order: Order) => order.price.value !== 19546.736));
      moduleCallerSvcMock.callPlanModule = jest.fn().mockResolvedValue(dumbPlan);
      moduleCallerSvcMock.callNetworkModule = jest
        .fn()
        .mockResolvedValueOnce(dumbOrdersCexWithChange)
        .mockReturnValueOnce([new Exchange()]);
      orderSvcMock.markAsFilled = jest.fn().mockImplementation((order: Order) => {
        order.status = OrderStatus.FILLED;
        return order;
      });
      orderSvcMock.create = jest.fn().mockImplementationOnce((order: Order) => {
        expect(order).toEqual(
          new OrderBuilder()
            .withAmount(50)
            .withPrice({ value: 18615.939, type: PriceType.LIMIT })
            .withStatus(OrderStatus.NEW)
            .withPair({ token1: 'BTC', token2: 'USDT' })
            .withSide(Side.BUY)
            .withPlanId('planId')
            .build(),
        );
        return order;
      });

      const exchanges: Exchange[] = await syncOrderSvc.synchronize('planId');
      expect(exchanges).toHaveLength(1);
      expect(orderSvcMock.create).toHaveBeenCalledTimes(1);
    });
  });
});
