import { Plan } from '@model/plan';
import { Order } from '@model/order';

export const increaseCeilingPlan: Plan = {
  _id: 'fakeid',
  pair: {
    token1: 'AZERO',
    token2: 'USDT',
  },
  platform: 'MEXC',
  priceMin: 0.5,
  step: 5,
  startAmount: 3000,
  amountPerStep: 150,
  stepLevels: [
    0.5, 0.525, 0.551, 0.579, 0.608, 0.638, 0.67, 0.704, 0.739, 0.776, 0.814, 0.855, 0.898, 0.943, 0.99, 1.039, 1.091,
    1.146, 1.203, 1.263, 1.327, 1.393, 1.463, 1.536, 1.613, 1.693, 1.778, 1.867, 1.96, 2.058, 2.161,
  ],
  __v: 0,
  featureOverride: {},
};

export const increaseCeilingOrders: Order[] = [
  {
    _id: '62c9d83b6f5716a6af2abdeb',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.551,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62c9d83b6f5716a6af2abded',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.579,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62c9d83b6f5716a6af2abdf3',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.525,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62c9d83b6f5716a6af2abdf5',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.5,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62c9d83b6f5716a6af2abe11',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.67,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62c9d83b6f5716a6af2abdef',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.608,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62c9d83b6f5716a6af2abdf1',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 0.638,
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62d11b5bf1e859ec69bc1bf8',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.704,
      type: 'LIMIT',
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62d12e57f1e859ec69bc1c0c',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.739,
      type: 'LIMIT',
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62d2c82ff1e859ec69bc1d68',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.776,
      type: 'LIMIT',
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '62d4efcef1e859ec69bc1f43',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.814,
      type: 'LIMIT',
    },
    side: 'BUY',
    __v: 0,
  },
  {
    _id: '631eb4dd7eca85451937294c',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 1.327,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '63209af57eca854519372ae8',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 1.263,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '632205257eca854519372c1c',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 1.203,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '63238e4f7eca854519372d6a',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 1.146,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '632cc0ebf41a6986e7972dc8',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 1.091,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '632f6d7a9154285574274627',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 1.393,
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '632f6d7a915428557427462a',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 1.463,
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '632f6d7a915428557427462d',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 1.536,
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '632f6d7b9154285574274630',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 1.613,
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '633bbb19e3ac1b70c46fbac5',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 1.693,
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '633bf346e3ac1b70c46fbafb',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      type: 'LIMIT',
      value: 1.778,
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '633ee56ee3ac1b70c46fbd93',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 1.039,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '63411820e3ac1b70c46fbf64',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.99,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '635061311019b2ea1321fbb0',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.943,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
  {
    _id: '635261481019b2ea1321fd63',
    planId: 'fakeid',
    pair: {
      token1: 'AZERO',
      token2: 'USDT',
    },
    amount: 150,
    status: 'NEW',
    price: {
      value: 0.898,
      type: 'LIMIT',
    },
    side: 'SELL',
    __v: 0,
  },
] as Order[];
