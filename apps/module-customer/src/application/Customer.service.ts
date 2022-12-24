import { Injectable } from '@nestjs/common';
import { CustomerRequest } from '../presentation/CustomerRequest';
import { CustomerResource } from './Customer.resource';
import { Customer } from '../domain/Customer';
import { PasswordHasherService } from './Password.hasher.service';
import { CustomerRepository } from '../infrastructure/Customer.repository';
import { v4 as uuidv4 } from 'uuid';
import { InjectConnection } from '@nestjs/mongoose';
import { ClientSession, Connection } from 'mongoose';
import { PasswordRepository } from '../infrastructure/Password.repository';
import { Password } from '../domain/Password';

@Injectable()
export class CustomerService {
  constructor(
    private readonly passwordHasherService: PasswordHasherService,
    @InjectConnection() private readonly connection: Connection,
    private readonly customerRepository: CustomerRepository,

    private readonly passwordRepository: PasswordRepository,
  ) {}

  async createCustomer(request: CustomerRequest): Promise<CustomerResource> {
    const hashedPassword = this.passwordHasherService.hash(request.Password);
    const customerId = this.generateId();
    const password = new Password(customerId, hashedPassword);
    const customer: Customer = new Customer(customerId, request.Name, request.Email);

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
    console.log('session started');
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
