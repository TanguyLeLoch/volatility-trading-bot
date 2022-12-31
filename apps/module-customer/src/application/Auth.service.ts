import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Customer } from '../domain/Customer';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomerDocument } from '../infrastructure/CustomerDocument';
import { PasswordDocument } from '../infrastructure/Password.document';
import { CustomerRepositoryMemory } from '../infrastructure/customer.repository.memory';
import { PasswordRepositoryMemory } from '../infrastructure/Password.repository.memory';
import { CustomerRepositoryMongo } from '../infrastructure/customer.repository.mongo';
import { PasswordRepositoryMongo } from '../infrastructure/Password.repository.mongo';
import { CustomerRepository } from '../infrastructure/Customer.repository';
import { PasswordRepository } from '../infrastructure/Password.repository';
import { LoginRequest } from '../presentation/LoginRequest';
import { Password } from '../domain/Password';

const SALT_ROUND = 10;

@Injectable()
export class AuthService {
  private readonly customerRepository: CustomerRepository;
  private readonly passwordRepository: PasswordRepository;

  constructor(
    private jwtService: JwtService,
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

  static hash(password: string): string {
    return bcrypt.hashSync(password, SALT_ROUND);
  }

  private compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  async login(loginRequest: LoginRequest): Promise<string> {
    const customer: Customer | null = await this.customerRepository.findByEmail(loginRequest.email);
    if (customer === null) {
      throw new ForbiddenException('Customer not found');
    }
    const password: Password = await this.passwordRepository.get(customer.id);
    const isPasswordValid = this.compare(loginRequest.password, password.hashedPassword);
    if (isPasswordValid) {
      return this.jwtService.sign({ id: customer.id, email: customer.email });
    }
    throw new ForbiddenException('Invalid password');
  }
}
