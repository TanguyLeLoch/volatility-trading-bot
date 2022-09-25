export class DiscordMessage {
  type: DiscordMessageType;
  params: Record<string, any>;
}

export enum DiscordMessageType {
  SYNC = 'SYNC',
  BUY = 'BUY',
  SELL = 'SELL',
  INCREASE_CEILING = 'INCREASE_CEILING',
}
