export class Customer {
  private readonly id: string;
  private readonly name: string;
  private readonly email: string;

  get Id(): string {
    return this.id;
  }

  get Name(): string {
    return this.name;
  }

  get Email(): string {
    return this.email;
  }

  constructor(id: string, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
  }
}
