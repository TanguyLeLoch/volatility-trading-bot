import { CustomerDocument } from './CustomerDocument';

describe('Customer document', () => {
  it('should create a CustomerDocument', () => {
    const customerDocument = new CustomerDocument('Sam', 'sam@ftx.com', 'solid-password-hash');
    expect(customerDocument.Name).toBe('Sam');
    expect(customerDocument.Email).toBe('sam@ftx.com');
  });
});
