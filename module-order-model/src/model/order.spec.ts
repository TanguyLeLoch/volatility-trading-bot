import { Order, OrderSchema } from './order';
import { Status } from './order.status';

describe('Order object', () => {
  it('should create a order object', () => {
    const order: Order = new Order('token1', 'token2', 1, Status.OPEN);
    expect(order).toBeDefined();
    expect(order.token1).toBe('token1');
    expect(order.token2).toBe('token2');
    expect(order.quantity).toBe(1);
    expect(order.status).toBe('OPEN');
  });
});

describe('Order schema', () => {
  it('should create the order schema', () => {
    expect(OrderSchema).toBeDefined();
  });
});
