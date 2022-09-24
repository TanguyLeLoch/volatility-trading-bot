import { ModuleCallerSvc } from '@app/core';
import { Order } from '@model/order';
import { Plan } from '@model/plan';
import { orderToCreate } from '../../test/mock/mock.order.service';
import { OrderSvc } from './order.service';

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
  it('test test', async () => {
    const mockFunction = jest.fn((x) => x * 2);
    mockFunction(123);
    expect(mockFunction.mock.calls[0][0]).toBe(123);
  });
});
