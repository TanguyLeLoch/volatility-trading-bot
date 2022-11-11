import { Platform } from '@model/common';

export class GridCredential {
  private readonly platform: Platform;
  private readonly apiKey: string;
  private readonly secretKey: string;

  constructor(platform: Platform, apiKey: string, secretKey: string) {
    this.platform = platform;
    this.apiKey = apiKey;
    this.secretKey = secretKey;
  }
}
