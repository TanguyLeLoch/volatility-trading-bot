import { Schema } from '@nestjs/mongoose';

@Schema({ timestamps: true })
export class CustomerDocument {
  private readonly name: string;
  private readonly email: string;

  private readonly hashPassword: string;

  get Name(): string {
    return this.name;
  }

  get Email(): string {
    return this.email;
  }

  constructor(name: string, email: string, hashPassword: string) {
    this.name = name;
    this.email = email;
    this.hashPassword = hashPassword;
  }
}
