import { PasswordDocument } from './Password.document';
import { PasswordRepository } from './Password.repository';
import { Password } from '../domain/Password';
import { Model } from 'mongoose';
import { plainToClass } from 'class-transformer';

export class PasswordRepositoryMongo implements PasswordRepository {
  constructor(private readonly passwordModel: Model<PasswordDocument>) {}

  async save(password: Password): Promise<void> {
    const passwordDocument: PasswordDocument = PasswordDocument.fromDomain(password);
    await this.passwordModel.create(passwordDocument);
  }

  async get(customerId: string): Promise<Password | null> {
    const passwordDocument = await this.passwordModel.findOne({ customerId }).exec();
    const passwordJson = passwordDocument.toJSON();
    if (passwordDocument) {
      const instance: PasswordDocument = plainToClass(PasswordDocument, passwordJson);
      return instance.toDomain();
    }
    return null;
  }
}
