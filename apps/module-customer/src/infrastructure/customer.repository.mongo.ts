import { Customer } from '../domain/Customer';
import { CustomerRepository } from './Customer.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDocument } from './CustomerDocument';

export class CustomerRepositoryMongo implements CustomerRepository {
  constructor(@InjectModel('Customer') private readonly customerModel: Model<CustomerDocument>) {}

  async save(customer: Customer): Promise<void> {
    const customerDocument: CustomerDocument = CustomerDocument.fromCustomer(customer);
    await this.customerModel.create(customerDocument);
  }

  async get(id: string): Promise<Customer | null> {
    const customerDocument: CustomerDocument = await this.customerModel.findById(id).exec();
    if (customerDocument) {
      return customerDocument.toCustomer();
    }
    return null;
  }
}
