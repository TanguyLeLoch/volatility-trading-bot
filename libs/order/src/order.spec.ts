import { Order, OrderSchema } from './order';

describe('Order object', () => {
  it('should create a order object', () => {
    const order: Order = new Order();
    expect(order).toBeDefined();
  });
});

describe('Order schema', () => {
  it('should create the order schema', () => {
    expect(OrderSchema).toBeDefined();
  });
});
