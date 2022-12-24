import { CustomerResponse } from '../presentation/CustomerResponse';
import { Customer } from '../domain/Customer';

export class CustomerResource {
  constructor(private readonly customer: Customer) {}

  get Id(): string {
    return this.customer.Id;
  }

  get Name(): string {
    return this.customer.Name;
  }

  get Email(): string {
    return this.customer.Email;
  }

  toResponse(): CustomerResponse {
    return new CustomerResponse(this.customer.Id, this.customer.Name, this.customer.Email);
  }
}
