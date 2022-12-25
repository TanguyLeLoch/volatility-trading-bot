import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Password } from '../domain/Password';

@Schema({ timestamps: true })
export class PasswordDocument {
  @Prop({ required: true })
  public readonly customerId: string;
  @Prop({ required: true })
  public readonly hashPassword: string;

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

export const PasswordSchema = SchemaFactory.createForClass(PasswordDocument);
