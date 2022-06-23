export class Pair {
  token1: string;
  token2: string;

  constructor(obj: { token1: string; token2: string }) {
    Object.assign(this, obj);
  }
  toString(): string {
    return `${this.token1}_${this.token2}`;
  }
}
