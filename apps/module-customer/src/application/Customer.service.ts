import { BadRequestException, Injectable } from '@nestjs/common';
import { CustomerRequest } from '../presentation/CustomerRequest';
import { CustomerResource } from './Customer.resource';
import { Customer } from '../domain/Customer';
import { CustomerRepository } from '../infrastructure/Customer.repository';
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
import { IdGenerator } from '@app/core/Id.generator';
import { AuthService } from './Auth.service';

@Injectable()
export class CustomerService {
  private readonly customerRepository: CustomerRepository;
  private readonly passwordRepository: PasswordRepository;

  constructor(
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
    await this.checkEmailUnique(request.email);
    const hashedPassword = AuthService.hash(request.password);
    const customerId = IdGenerator.generateId();
    const password = new Password(customerId, hashedPassword);
    const customer: Customer = new Customer(customerId, request.name, request.email);

    const success: boolean = await this.executeInTransaction(async (): Promise<void> => {
      await this.customerRepository.save(customer);
      await this.passwordRepository.save(password);
    });
    if (!success) {
      throw new Error('Could not create customer');
    }
    return new CustomerResource(customer);
  }

  private async checkEmailUnique(email: string): Promise<void> {
    const customer = await this.customerRepository.findByEmail(email);
    if (customer) {
      throw new BadRequestException('Email already exists');
    }
  }

  private async executeInTransaction(saveFunctions: () => Promise<void>): Promise<boolean> {
    const session: ClientSession = await this.connection.startSession();
    session.startTransaction();
    let success = false;
    try {
      await saveFunctions();
      await session.commitTransaction();
      success = true;
    } catch (error) {
      await session.abortTransaction();
    } finally {
      await session.endSession();
    }
    return success;
  }
}
