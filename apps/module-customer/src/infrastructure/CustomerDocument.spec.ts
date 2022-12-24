import { CustomerDocument } from './CustomerDocument';

describe('Customer document', () => {
  it('should create a CustomerDocument', () => {
    const customerDocument = new CustomerDocument('123', 'Sam', 'sam@ftx.com');
    expect(customerDocument.Name).toBe('Sam');
    expect(customerDocument.Email).toBe('sam@ftx.com');
  });
});
