import { ExternalCallerSvc } from '@app/core';
import { ExchangeSvc } from './exchange.service';
import { BinanceSvc } from './binance.service';
import { Order } from '@model/order';
import { dumbOrderCexMapped, dumbOrdersCex, throwErrorAtStatus } from '../../test/testHelper';
import { CexOrder } from '@model/network';
import { Utils } from '@model/common';

describe('test binance class', () => {
  const exchangeSvcMock: ExchangeSvc = {} as ExchangeSvc;
  const httpServiceMock: any = {} as any;
  const externalCallerSvc: ExternalCallerSvc = new ExternalCallerSvc(httpServiceMock);
  const binanceSvc = new BinanceSvc(externalCallerSvc, exchangeSvcMock);
  Utils.sleep = jest.fn(() => Promise.resolve());

  it('should be able retry after a 400 error', async () => {
    const ordersCex: CexOrder[] = dumbOrdersCex();
    httpServiceMock.axiosRef = jest
      .fn()
      .mockImplementationOnce(() => throwErrorAtStatus(400))
      .mockResolvedValueOnce({ data: ordersCex });

    const orders: Order[] = await binanceSvc.getActiveOrders({ token1: 'BTC', token2: 'BUSD' });

    expect(orders).toEqual(dumbOrderCexMapped());
  });
});
