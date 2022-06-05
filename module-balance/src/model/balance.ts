export class Balance {
  public token: string;
  public balance: number;
  public inOrder: number;
  public available: number;

  constructor(
    token: string,
    balance: number,
    inOrder: number,
    available: number,
  ) {
    this.token = token;
    this.balance = balance;
    this.inOrder = inOrder;
    this.available = available;
  }
}
