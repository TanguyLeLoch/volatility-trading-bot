import { Customer } from '../domain/Customer';
import { CustomerRepository } from './Customer.repository';
import { Model } from 'mongoose';
import { CustomerDocument } from './CustomerDocument';
import { plainToClass } from 'class-transformer';

export class CustomerRepositoryMongo implements CustomerRepository {
  constructor(private readonly customerModel: Model<CustomerDocument>) {}

  async save(customer: Customer): Promise<void> {
    const customerDocument: CustomerDocument = CustomerDocument.fromCustomer(customer);
    await this.customerModel.create(customerDocument);
  }

  async get(id: string): Promise<Customer | null> {
    const customerDocument: object = await this.customerModel.findById(id).exec();
    if (customerDocument) {
      const customerDocumentInstance: CustomerDocument = plainToClass(CustomerDocument, customerDocument);
      return customerDocumentInstance.toCustomer();
    }
    return null;
  }

  async findByEmail(email: string): Promise<Customer | null> {
    const customerDocument = await this.customerModel.findOne({ email: email }).exec();
    const customerJson = customerDocument.toJSON();
    if (customerDocument) {
      const customerDocumentInstance: CustomerDocument = plainToClass(CustomerDocument, customerJson);
      return customerDocumentInstance.toCustomer();
    }
    return null;
  }
}
