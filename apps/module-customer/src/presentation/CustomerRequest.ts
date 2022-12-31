import { IsNotEmpty, Matches } from 'class-validator';

export class CustomerRequest {
  @IsNotEmpty()
  public readonly name: string;
  @IsNotEmpty()
  public readonly email: string;
  @IsNotEmpty()
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
    message:
      'The password must contain at least 8 characters and at least one uppercase letter, ' +
      'one lowercase letter, and one number.',
  })
  public readonly password: string;

  constructor(name: string, email: string, password: string) {
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
