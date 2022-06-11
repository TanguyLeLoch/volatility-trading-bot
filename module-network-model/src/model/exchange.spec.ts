import { Exchange, ExchangeSchema } from './exchange';
import { ExchangeStatus } from './exchange.status';

describe('Exchange object', () => {
  const now = Date.now();
  it('should create a exchange object', () => {
    const exchange: Exchange = new Exchange(
      now,
      ExchangeStatus.ACCEPTED,
      'url',
      { key: 'value' },
    );
    expect(exchange).toBeDefined();
    expect(exchange).toEqual({
      date: now,
      status: ExchangeStatus.ACCEPTED,
      url: 'url',
      content: { key: 'value' },
    });
  });
});

describe('Exchange schema', () => {
  it('should create the exchange schema', () => {
    expect(ExchangeSchema).toBeDefined();
  });
});
