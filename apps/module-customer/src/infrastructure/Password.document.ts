import { Schema } from '@nestjs/mongoose';
import { Password } from '../domain/Password';

@Schema({ timestamps: true })
export class PasswordDocument {
  private readonly customerId: string;
  private readonly hashPassword: string;

  get CustomerId(): string {
    return this.customerId;
  }

  get HashPassword(): string {
    return this.hashPassword;
  }

  constructor(customerId: string, hashPassword: string) {
    this.customerId = customerId;
    this.hashPassword = hashPassword;
  }

  static fromDomain(password: Password): PasswordDocument {
    return new PasswordDocument(password.CustomerId, password.HashedPassword);
  }

  toDomain(): Password {
    return new Password(this.customerId, this.hashPassword);
  }
}
