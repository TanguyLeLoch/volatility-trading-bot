import { Password } from '../domain/Password';

export interface PasswordRepository {
  save(Password): Promise<void>;
  get(customerId: string): Promise<Password | null>;
}
