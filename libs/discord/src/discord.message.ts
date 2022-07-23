export class DiscordMessage {
  type: DiscordMessageType;
  params: Record<string, string>;
}

export enum DiscordMessageType {
  SYNC = 'SYNC',
  BUY = 'BUY',
  SELL = 'SELL',
}
