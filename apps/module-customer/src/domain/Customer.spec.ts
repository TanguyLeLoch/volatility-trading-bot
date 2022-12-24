import { Customer } from './Customer';

describe('Customer', () => {
  it('should create a new customer', () => {
    const customer = new Customer('234', 'Sam', 'sam@ftx.com');
    expect(customer).toBeDefined();
    expect(customer.Name).toBe('Sam');
    expect(customer.Email).toBe('sam@ftx.com');
  });
});
