import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const SALT_ROUND = 10;

@Injectable()
export class PasswordHasherService {
  hash(password: string): string {
    return bcrypt.hashSync(password, SALT_ROUND);
  }

  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }
}
