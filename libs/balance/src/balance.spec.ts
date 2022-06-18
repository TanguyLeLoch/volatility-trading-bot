import { Balance, BalanceSchema } from './balance';

describe('Balance object', () => {
  it('should create a balance object', () => {
    const balance = new Balance('tokenName', 'mexc', 1, 2, 3);
    expect(balance).toBeDefined();
    expect(balance.token).toBe('tokenName');
    expect(balance.balance).toBe(1);
    expect(balance.inOrder).toBe(2);
    expect(balance.available).toBe(3);
  });
});

describe('Balance schema', () => {
  it('should create the balance schema', () => {
    expect(BalanceSchema).toBeDefined();
  });
});
