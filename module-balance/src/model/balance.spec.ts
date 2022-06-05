import { Balance } from './balance';

describe('Balance object', () => {
  it('should create a balance object"', () => {
    const balance = new Balance('tokenName', 1, 2, 3);
    expect(balance).toBeDefined();
    expect(balance.token).toBe('tokenName');
    expect(balance.balance).toBe(1);
    expect(balance.inOrder).toBe(2);
    expect(balance.available).toBe(3);
  });
});
