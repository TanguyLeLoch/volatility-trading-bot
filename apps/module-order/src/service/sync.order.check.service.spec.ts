import { Order, OrderStatus, PriceType, Side } from '@model/order';
import { SyncOrderCheckSvc } from './sync.order.check.service';

describe('SyncOrderSvc', () => {
  let syncOrderCheckSvc: SyncOrderCheckSvc;

  beforeEach(() => {
    syncOrderCheckSvc = new SyncOrderCheckSvc();
  });
  it('should be defined', () => {
    expect(syncOrderCheckSvc).toBeDefined();
  });
  describe('perform OK check', () => {
    it('should perform OK check', () => {
      const ordersCex: Order[] = [
        {
          _id: '62cc155c96ce385a89003448',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.BUY,
          amount: 202.97,
          price: { type: PriceType.LIMIT, value: 0.739 },
          status: OrderStatus.NEW,
        },
        {
          _id: '62c9d83b6f5716a6af2abe0d',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.SELL,

          amount: 113.03,
          price: { type: PriceType.LIMIT, value: 1.327 },
          status: OrderStatus.NEW,
        },
      ];
      const ordersDb: Order[] = [
        {
          _id: '62cc155c96ce385a89003448',
          planId: 'monPlan',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.BUY,
          amount: 202.97,
          price: { type: PriceType.LIMIT, value: 0.739 },
          status: OrderStatus.NEW,
        },
        {
          _id: '62c9d83b6f5716a6af2abe0d',
          planId: 'monPlan',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.SELL,

          amount: 113.03,
          price: { type: PriceType.LIMIT, value: 1.327 },
          status: OrderStatus.NEW,
        },
      ];
      expect(() => syncOrderCheckSvc.checkOrders(ordersCex, ordersDb)).not.toThrowError();
    });
  });
  describe('perform KO check', () => {
    let ordersCex: Order[];
    let ordersDb: Order[];
    beforeEach(() => {
      ordersCex = [
        {
          _id: '62cc155c96ce385a89003448',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.BUY,
          amount: 202.97,
          price: { type: PriceType.LIMIT, value: 0.739 },
          status: OrderStatus.NEW,
        },
        {
          _id: '62c9d83b6f5716a6af2abe0d',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.SELL,

          amount: 113.03,
          price: { type: PriceType.LIMIT, value: 1.327 },
          status: OrderStatus.NEW,
        },
      ];
      ordersDb = [
        {
          _id: '62cc155c96ce385a89003448',
          planId: 'monPlan',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.BUY,
          amount: 202.97,
          price: { type: PriceType.LIMIT, value: 0.739 },
          status: OrderStatus.NEW,
        },
        {
          _id: '62c9d83b6f5716a6af2abe0d',
          planId: 'monPlan',
          pair: { token1: 'AZERO', token2: 'USDT' },
          side: Side.SELL,

          amount: 113.03,
          price: { type: PriceType.LIMIT, value: 1.327 },
          status: OrderStatus.NEW,
        },
      ];
    });
    it('should throw ORDER_NOT_OPEN_ON_CEX exception', () => {
      ordersCex[0].status = OrderStatus.CANCELLED;
      expect(() => syncOrderCheckSvc.checkOrders(ordersCex, ordersDb)).toThrowError('ORDER_NOT_OPEN_ON_CEX');
    });
    it('should throw NO_ORDERS_ON_CEX exception', () => {
      ordersCex = [];
      expect(() => syncOrderCheckSvc.checkOrders(ordersCex, ordersDb)).toThrowError('NO_ORDERS_ON_CEX');
    });
    it('should throw MORE_ORDER_ON_CEX exception', () => {
      ordersDb.pop();
      expect(() => syncOrderCheckSvc.checkOrders(ordersCex, ordersDb)).toThrowError('MORE_ORDER_ON_CEX');
    });
    it('should throw TOO_MANY_ORDER_TRIGGERED exception', () => {
      while (ordersDb.length < 5 + ordersCex.length) {
        ordersDb = ordersDb.concat(ordersDb);
      }
      expect(() => syncOrderCheckSvc.checkOrders(ordersCex, ordersDb)).toThrowError('TOO_MANY_ORDER_TRIGGERED');
    });

    it('should throw UNKNOWN_ORDER_ON_CEX exception', () => {
      ordersCex[0]._id = 'fakeid';
      expect(() => syncOrderCheckSvc.checkOrders(ordersCex, ordersDb)).toThrowError('UNKNOWN_ORDER_ON_CEX');
    });
  });
});
