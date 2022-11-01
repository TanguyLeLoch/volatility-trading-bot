import { CexOrder } from '@model/network';
import { Order } from '@model/order';

const throwErrorAtStatus = (status: number): never => {
  const error = new Error() as any;
  error.status = status;
  throw error;
};

const dumbOrdersCex = (): CexOrder[] => {
  return [
    {
      _id: '6360dc55e0a35291532faa4f',
      symbol: 'BTCBUSD',
      clientOrderId: '6360dc555beb9fd08a28912a',
      price: '17000',
      origQty: '0.00294',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667292245496,
      updateTime: 1667292245512,
      __v: 0,
    },
    {
      _id: '6360dc55e0a35291532faa55',
      symbol: 'BTCBUSD',
      clientOrderId: '6360dc555beb9fd08a28912c',
      price: '17850',
      origQty: '0.0028',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667292245519,
      updateTime: 1667292245531,
      __v: 0,
    },
    {
      _id: '6360dcc3e0a35291532faab7',
      symbol: 'BTCBUSD',
      clientOrderId: '6360dcc3b45c1e8bc2b46f4d',
      price: '29075.769',
      origQty: '0.00172',
      status: 'NEW',
      type: 'LIMIT',
      side: 'SELL',
      time: 1667292355418,
      updateTime: 1667292355422,
      __v: 0,
    },
    {
      _id: '6360dcc3e0a35291532faabd',
      symbol: 'BTCBUSD',
      clientOrderId: '6360dcc3b45c1e8bc2b46f50',
      price: '30529.558',
      origQty: '0.00164',
      status: 'NEW',
      type: 'LIMIT',
      side: 'SELL',
      time: 1667292355445,
      updateTime: 1667292355449,
      __v: 0,
    },
    {
      _id: '6360fb8d9ecb852e0bc34bf1',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fb8d2b527356bb080626',
      price: '32056.035',
      origQty: '0.00156',
      status: 'NEW',
      type: 'LIMIT',
      side: 'SELL',
      time: 1667300237517,
      updateTime: 1667300237540,
      __v: 0,
    },
    {
      _id: '6360fbbb9ecb852e0bc34c54',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbbb2b527356bb080655',
      price: '18742.5',
      origQty: '0.00267',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667300283137,
      updateTime: 1667300283145,
      __v: 0,
    },
    {
      _id: '6360fbbb9ecb852e0bc34c5a',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbbb2b527356bb080658',
      price: '19679.625',
      origQty: '0.00254',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667300283157,
      updateTime: 1667300283166,
      __v: 0,
    },
    {
      _id: '6360fbbf9ecb852e0bc34c71',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbbf2b527356bb080662',
      price: '20663.606',
      origQty: '0.00242',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667300287104,
      updateTime: 1667300287116,
      __v: 0,
    },
    {
      _id: '6360fbbf9ecb852e0bc34c77',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbbf2b527356bb080665',
      price: '21696.787',
      origQty: '0.0023',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667300287134,
      updateTime: 1667300287145,
      __v: 0,
    },
    {
      _id: '6360fbcb9ecb852e0bc34c87',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbcb2b527356bb08066d',
      price: '22781.626',
      origQty: '0.00219',
      status: 'NEW',
      type: 'LIMIT',
      side: 'BUY',
      time: 1667300299094,
      updateTime: 1667300299110,
      __v: 0,
    },
    {
      _id: '6360fbdd9ecb852e0bc34cd1',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbdd2b527356bb08068d',
      price: '27691.209',
      origQty: '0.00181',
      status: 'NEW',
      type: 'LIMIT',
      side: 'SELL',
      time: 1667300317124,
      updateTime: 1667300317128,
      __v: 0,
    },
    {
      _id: '6360fbdd9ecb852e0bc34cd7',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbdd2b527356bb080690',
      price: '26372.58',
      origQty: '0.0019',
      status: 'NEW',
      type: 'LIMIT',
      side: 'SELL',
      time: 1667300317136,
      updateTime: 1667300317141,
      __v: 0,
    },
    {
      _id: '6360fbdd9ecb852e0bc34cdd',
      symbol: 'BTCBUSD',
      clientOrderId: '6360fbdd2b527356bb080693',
      price: '25116.743',
      origQty: '0.00199',
      status: 'NEW',
      type: 'LIMIT',
      side: 'SELL',
      time: 1667300317149,
      updateTime: 1667300317153,
      __v: 0,
    },
  ] as unknown as CexOrder[];
};

const dumbOrderCexMapped = (): Order[] => {
  return [
    {
      _id: '6360dc555beb9fd08a28912a',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.00294,
      price: { type: 'LIMIT', value: 17000 },
      status: 'NEW',
      updatedAt: '2022-11-01T08:44:05.512Z',
    },
    {
      _id: '6360dc555beb9fd08a28912c',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.0028,
      price: { type: 'LIMIT', value: 17850 },
      status: 'NEW',
      updatedAt: '2022-11-01T08:44:05.531Z',
    },
    {
      _id: '6360dcc3b45c1e8bc2b46f4d',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'SELL',
      amount: 0.00172,
      price: { type: 'LIMIT', value: 29075.769 },
      status: 'NEW',
      updatedAt: '2022-11-01T08:45:55.422Z',
    },
    {
      _id: '6360dcc3b45c1e8bc2b46f50',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'SELL',
      amount: 0.00164,
      price: { type: 'LIMIT', value: 30529.558 },
      status: 'NEW',
      updatedAt: '2022-11-01T08:45:55.449Z',
    },
    {
      _id: '6360fb8d2b527356bb080626',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'SELL',
      amount: 0.00156,
      price: { type: 'LIMIT', value: 32056.035 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:57:17.540Z',
    },
    {
      _id: '6360fbbb2b527356bb080655',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.00267,
      price: { type: 'LIMIT', value: 18742.5 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:03.145Z',
    },
    {
      _id: '6360fbbb2b527356bb080658',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.00254,
      price: { type: 'LIMIT', value: 19679.625 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:03.166Z',
    },
    {
      _id: '6360fbbf2b527356bb080662',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.00242,
      price: { type: 'LIMIT', value: 20663.606 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:07.116Z',
    },
    {
      _id: '6360fbbf2b527356bb080665',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.0023,
      price: { type: 'LIMIT', value: 21696.787 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:07.145Z',
    },
    {
      _id: '6360fbcb2b527356bb08066d',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'BUY',
      amount: 0.00219,
      price: { type: 'LIMIT', value: 22781.626 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:19.110Z',
    },
    {
      _id: '6360fbdd2b527356bb08068d',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'SELL',
      amount: 0.00181,
      price: { type: 'LIMIT', value: 27691.209 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:37.128Z',
    },
    {
      _id: '6360fbdd2b527356bb080690',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'SELL',
      amount: 0.0019,
      price: { type: 'LIMIT', value: 26372.58 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:37.141Z',
    },
    {
      _id: '6360fbdd2b527356bb080693',
      pair: { token1: 'BTC', token2: 'BUSD' },
      side: 'SELL',
      amount: 0.00199,
      price: { type: 'LIMIT', value: 25116.743 },
      status: 'NEW',
      updatedAt: '2022-11-01T10:58:37.153Z',
    },
  ] as Order[];
};
export { throwErrorAtStatus, dumbOrdersCex, dumbOrderCexMapped };
