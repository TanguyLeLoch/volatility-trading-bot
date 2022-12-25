import { Customer } from '../domain/Customer';
import { CustomerRepository } from './Customer.repository';
import { CustomerDocument } from './CustomerDocument';

export class CustomerRepositoryMemory implements CustomerRepository {
  private static customers = new Map<string, CustomerDocument>();

  async save(customer: Customer): Promise<void> {
    const customerDocument: CustomerDocument = CustomerDocument.fromCustomer(customer);
    CustomerRepositoryMemory.customers.set(customerDocument._id, customerDocument);
  }

  async findByEmail(email: string): Promise<Customer | null> {
    for (const customerDocument of CustomerRepositoryMemory.customers.values()) {
      if (customerDocument.email === email) {
        return customerDocument.toCustomer();
      }
    }
    return null;
  }

  async get(id: string): Promise<Customer | null> {
    const customerDocument: CustomerDocument = CustomerRepositoryMemory.customers.get(id);
    if (customerDocument) {
      return customerDocument.toCustomer();
    }
    return null;
  }
}
