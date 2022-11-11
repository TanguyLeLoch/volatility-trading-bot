import { GridCredential } from './GridCredential';

export class Customer {
  id: number;
  name: string;
  email: string;
  credentials: GridCredential[];

  constructor(id: number, name: string, email: string) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.credentials = [];
  }

  addCredential(credential: GridCredential): void {
    this.credentials.push(credential);
  }
}
