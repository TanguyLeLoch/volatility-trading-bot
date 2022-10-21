import { ModuleCallerSvc } from '@app/core';
import { Order } from '@model/order';
import { Plan } from '@model/plan';
import { orderToCreate } from '../../test/mock/mock.order.service';
import { OrderSvc } from './order.service';
import { increaseCeilingOrders, increaseCeilingPlan } from '../../test/mock/mockIncreaseCeiling';
import { Exchange } from '@model/network';

describe('OrderSvc', () => {
  const moduleCallerSvcMock: ModuleCallerSvc = {} as any;
  const orderModelMock = {} as any;
  const orderSvc = new OrderSvc(orderModelMock, moduleCallerSvcMock);

  it('should be defined', () => {
    expect(orderSvc).toBeDefined();
  });
  it('should createByPlan', async () => {
    const createMock = jest.fn().mockImplementation((order) => {
      return order;
    }) as any;
    orderSvc.create = createMock;
    orderSvc.modify = jest.fn().mockImplementation((order) => order);
    const plan: Plan = {
      _id: 'id123',
      pair: { token1: 'BTC', token2: 'USDT' },
      platform: 'MEXC',
      priceMin: 16000,
      step: 10,
      startAmount: 1000,
      amountPerStep: 200,
      stepLevels: [16000, 17600, 19360, 21296, 23425.6, 25768.16],
      __v: 0,
      featureOverride: {},
    };

    moduleCallerSvcMock.callNetworkModule = jest.fn().mockReturnValue(Promise.resolve({ price: 19200 }));
    await orderSvc.createByPlan(plan);
    expect(createMock.mock.calls.map((arr: Order) => arr[0])).toEqual(orderToCreate);
  });
  it('should create new order of increase ceiling', async () => {
    const plan: Plan = increaseCeilingPlan;
    moduleCallerSvcMock.callPlanModule = jest.fn().mockReturnValue(plan);
    moduleCallerSvcMock.callNetworkModule = jest.fn().mockImplementation(() => {
      new Exchange();
    });
    const execFind = jest.fn().mockReturnValue(increaseCeilingOrders);
    orderModelMock.find = jest.fn().mockReturnValue({ exec: execFind });
    const exchanges: Exchange[] = await orderSvc.increaseCeiling({
      module: 'order',
      name: 'increaseCeiling',
      planId: plan._id,
    });
    expect(exchanges).toHaveLength(4);
  });
});
