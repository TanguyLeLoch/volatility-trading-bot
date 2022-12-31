import { Customer } from '../domain/Customer';
import { CustomerDocument } from '../infrastructure/CustomerDocument';
import { Mapper } from './Mapper';

describe('customer mapper', () => {
  it('should map a customer to a customerDocument', () => {
    // given
    const customer: Customer = new Customer('id', 'Sam', 'sam@ftx.com');
    // when
    const customerDocument: CustomerDocument = Mapper.toDocument(customer);

    // then
    expect(customerDocument.name).toBe('Sam');
    expect(customerDocument.email).toBe('sam@ftx.com');
  });
});
