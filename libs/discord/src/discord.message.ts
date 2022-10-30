export class DiscordMessage {
  type: DiscordMessageType;
  params: Record<string, any>;
}

export enum DiscordMessageType {
  BUY = 'BUY',
  CREATE = 'CREATE',
  INCREASE_CEILING = 'INCREASE_CEILING',
  SELL = 'SELL',
  SYNC = 'SYNC',
  TRIGGER = 'TRIGGER',
}
