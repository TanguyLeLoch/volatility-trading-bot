import { Customer } from '../domain/Customer';
import { CustomerRepository } from './Customer.repository';
import { CustomerDocument } from './CustomerDocument';

export class CustomerRepositoryMemory implements CustomerRepository {
  private static customers = new Map<string, CustomerDocument>();

  async save(customer: Customer): Promise<void> {
    const customerDocument: CustomerDocument = CustomerDocument.fromCustomer(customer);
    CustomerRepositoryMemory.customers.set(customerDocument.id, customerDocument);
  }

  async get(id: string): Promise<Customer | null> {
    const customerDocument: CustomerDocument = CustomerRepositoryMemory.customers.get(id);
    if (customerDocument) {
      return customerDocument.toCustomer();
    }
    return null;
  }
}
