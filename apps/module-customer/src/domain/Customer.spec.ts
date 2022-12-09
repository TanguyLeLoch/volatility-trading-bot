import { Customer } from './Customer';

describe('Customer', () => {
  it('should create a new customer', () => {
    const customer = new Customer('Sam', 'sam@ftx.com', 'solid-password-hash');
    expect(customer).toBeDefined();
    expect(customer.Name).toBe('Sam');
    expect(customer.Email).toBe('sam@ftx.com');
    expect(customer.HashPassword).toBe('solid-password-hash');
  });
});
