import { Exchange, ExchangeSchema } from './exchange';

describe('Exchange object', () => {
  it('should create a exchange object', () => {
    const exchange: Exchange = new Exchange();
    expect(exchange).toBeDefined();
  });
});

describe('Exchange schema', () => {
  it('should create the exchange schema', () => {
    expect(ExchangeSchema).toBeDefined();
  });
});
