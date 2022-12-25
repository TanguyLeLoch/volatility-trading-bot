import { PasswordDocument } from './Password.document';
import { PasswordRepository } from './Password.repository';
import { Password } from '../domain/Password';
import { Model } from 'mongoose';

export class PasswordRepositoryMongo implements PasswordRepository {
  constructor(private readonly passwordModel: Model<PasswordDocument>) {}

  async save(password: Password): Promise<void> {
    const passwordDocument: PasswordDocument = PasswordDocument.fromDomain(password);
    await this.passwordModel.create(passwordDocument);
  }

  async get(customerId: string): Promise<Password | null> {
    const passwordDocument: PasswordDocument = await this.passwordModel.findById(customerId).exec();
    if (passwordDocument) {
      return passwordDocument.toDomain();
    }
    return null;
  }
}
