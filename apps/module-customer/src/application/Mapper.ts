import { CustomerDocument } from '../infrastructure/CustomerDocument';
import { Customer } from '../domain/Customer';

export class Mapper {
  static toDocument(customer: Customer): CustomerDocument {
    return new CustomerDocument(customer.Name, customer.Email, customer.HashPassword);
  }
}
