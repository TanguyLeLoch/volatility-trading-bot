import { Customer } from '../domain/Customer';
import { CustomerDocument } from '../infrastructure/CustomerDocument';
import { Mapper } from './Mapper';

describe('customer mapper', () => {
  it('should map a customer to a customerDocument', () => {
    // given
    const customer: Customer = new Customer('Sam', 'sam@ftx.com', 'solid-password-hash');
    // when
    const customerDocument: CustomerDocument = Mapper.toDocument(customer);
    // then
    expect(customerDocument.Name).toBe('Sam');
    expect(customerDocument.Email).toBe('sam@ftx.com');
  });
});
