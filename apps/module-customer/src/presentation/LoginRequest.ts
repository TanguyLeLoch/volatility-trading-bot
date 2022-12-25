import { IsNotEmpty } from 'class-validator';

export class LoginRequest {
  @IsNotEmpty()
  public readonly email: string;
  @IsNotEmpty()
  public readonly password: string;

  constructor(email: string, password: string) {
    this.email = email;
    this.password = password;
  }
}
