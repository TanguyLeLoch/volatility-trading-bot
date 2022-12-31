import { CustomerDocument } from './CustomerDocument';

describe('Customer document', () => {
  it('should create a CustomerDocument', () => {
    const customerDocument = new CustomerDocument('123', 'Sam', 'sam@ftx.com');
    expect(customerDocument.name).toBe('Sam');
    expect(customerDocument.email).toBe('sam@ftx.com');
  });
});
