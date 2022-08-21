import { BalanceBuilder, BalanceSchema } from './balance';

describe('Balance object', () => {
  it('should create a balance object with builder', () => {
    const balanceBuilder = new BalanceBuilder();
    const balanceBuilt = balanceBuilder
      .withId('123')
      .withToken('token')
      .withPlatform('platform')
      .withInOrder(1)
      .withAvailable(2)
      .build();

    expect(balanceBuilt).toBeDefined();
    expect(balanceBuilt._id).toEqual('123');
    expect(balanceBuilt.token).toEqual('token');
    expect(balanceBuilt.platform).toEqual('platform');
    expect(balanceBuilt.inOrder).toEqual(1);
    expect(balanceBuilt.available).toEqual(2);
  });
});

describe('Balance schema', () => {
  it('should create the balance schema', () => {
    expect(BalanceSchema).toBeDefined();
  });
});
