import { Injectable } from '@nestjs/common';
import { CustomerRequest } from '../presentation/CustomerRequest';
import { CustomerResource } from './Customer.resource';
import { Customer } from '../domain/Customer';
import { PasswordHasherService } from './Password.hasher.service';
import { CustomerRepository } from '../infrastructure/Customer.repository';
import { v4 as uuidv4 } from 'uuid';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { ClientSession, Connection, Model } from 'mongoose';
import { PasswordRepository } from '../infrastructure/Password.repository';
import { Password } from '../domain/Password';
import { CustomerRepositoryMongo } from '../infrastructure/customer.repository.mongo';
import { CustomerDocument } from '../infrastructure/CustomerDocument';
import { CustomerRepositoryMemory } from '../infrastructure/customer.repository.memory';
import { PasswordDocument } from '../infrastructure/Password.document';
import { PasswordRepositoryMemory } from '../infrastructure/Password.repository.memory';
import { PasswordRepositoryMongo } from '../infrastructure/Password.repository.mongo';

@Injectable()
export class CustomerService {
  private readonly customerRepository: CustomerRepository;
  private readonly passwordRepository: PasswordRepository;

  constructor(
    private readonly passwordHasherService: PasswordHasherService,
    @InjectConnection() private readonly connection: Connection,
    @InjectModel('Customer') private readonly customerModel: Model<CustomerDocument>,
    @InjectModel('Password') private readonly passwordModel: Model<PasswordDocument>,
  ) {
    if (process.env.TEST_MODE === 'true') {
      this.customerRepository = new CustomerRepositoryMemory();
      this.passwordRepository = new PasswordRepositoryMemory();
    } else {
      this.customerRepository = new CustomerRepositoryMongo(customerModel);
      this.passwordRepository = new PasswordRepositoryMongo(passwordModel);
    }
  }

  async createCustomer(request: CustomerRequest): Promise<CustomerResource> {
    const hashedPassword = this.passwordHasherService.hash(request.password);
    const customerId = this.generateId();
    const password = new Password(customerId, hashedPassword);
    const customer: Customer = new Customer(customerId, request.name, request.email);

    await this.executeInTransaction(async (): Promise<void> => {
      await this.customerRepository.save(customer);
      await this.passwordRepository.save(password);
    });
    return new CustomerResource(customer);
  }

  private generateId(): string {
    return uuidv4();
  }

  private async executeInTransaction(saveFunctions: () => Promise<void>): Promise<void> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();
    try {
      await saveFunctions();
      await session.commitTransaction();
    } catch (error) {
      console.log(error);
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
  }
}
