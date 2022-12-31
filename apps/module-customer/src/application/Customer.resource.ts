import { CustomerResponse } from '../presentation/CustomerResponse';
import { Customer } from '../domain/Customer';

export class CustomerResource {
  constructor(private readonly customer: Customer) {}

  get id(): string {
    return this.customer.id;
  }

  get name(): string {
    return this.customer.name;
  }

  get email(): string {
    return this.customer.email;
  }

  toResponse(): CustomerResponse {
    return new CustomerResponse(this.customer.id, this.customer.name, this.customer.email);
  }
}
