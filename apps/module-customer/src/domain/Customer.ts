export class Customer {
  private readonly name: string;
  private readonly email: string;
  private readonly hashPassword: string;

  get Name(): string {
    return this.name;
  }

  get Email(): string {
    return this.email;
  }

  get HashPassword(): string {
    return this.hashPassword;
  }

  constructor(name: string, email: string, hashPassword: string) {
    this.name = name;
    this.email = email;
    this.hashPassword = hashPassword;
  }
}
