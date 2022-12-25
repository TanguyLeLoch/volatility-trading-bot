import { PasswordDocument } from './Password.document';
import { PasswordRepository } from './Password.repository';
import { Password } from '../domain/Password';

export class PasswordRepositoryMemory implements PasswordRepository {
  private static passwords = new Map<string, PasswordDocument>();

  async save(password: Password): Promise<void> {
    const passwordDocument: PasswordDocument = PasswordDocument.fromDomain(password);
    PasswordRepositoryMemory.passwords.set(passwordDocument.customerId, passwordDocument);
  }

  async get(customerId: string): Promise<Password | null> {
    const passwordDocument: PasswordDocument = PasswordRepositoryMemory.passwords.get(customerId);
    if (passwordDocument) {
      return passwordDocument.toDomain();
    }
    return null;
  }
}
