import { Schema } from '@nestjs/mongoose';
import { Customer } from '../domain/Customer';

@Schema({ timestamps: true })
export class CustomerDocument {
  private readonly _id: string;
  private readonly name: string;
  private readonly email: string;

  get Id(): string {
    return this._id;
  }

  get Name(): string {
    return this.name;
  }

  get Email(): string {
    return this.email;
  }

  constructor(id: string, name: string, email: string) {
    this._id = id;
    this.name = name;
    this.email = email;
  }

  static fromCustomer(customer: Customer): CustomerDocument {
    return new CustomerDocument(customer.Id, customer.Name, customer.Email);
  }
  toCustomer(): Customer {
    return new Customer(this._id, this.name, this.email);
  }
}
