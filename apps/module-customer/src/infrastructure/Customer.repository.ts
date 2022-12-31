import { Customer } from '../domain/Customer';

export interface CustomerRepository {
  save(customer: Customer): Promise<void>;

  get(id: string): Promise<Customer | null>;

  findByEmail(email: string): Promise<Customer | null>;
}
