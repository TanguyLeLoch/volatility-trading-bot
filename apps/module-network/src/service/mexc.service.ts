import { Header, Injectable, Logger } from '@nestjs/common';
import { ExternalCallerSvc, Method } from '@app/core';
import { Order } from '@model/order';
import * as CryptoJS from 'crypto-js';
import { Pair } from '@model/common';

@Injectable()
export class MexcSvc {
  private readonly logger = new Logger(MexcSvc.name);
  private readonly mexcBaseUrl = 'https://api.mexc.com';
  constructor(private readonly externalCallerSvc: ExternalCallerSvc) {}

  async getActiveOrders(): Promise<Order> {
    let url = this.mexcBaseUrl + '/api/v3/openOrders';
    const params: Map<string, string> = new Map();
    params.set('symbol', 'AZEROUSDT');
    // params.set('side', 'BUY');
    // params.set('type', 'LIMIT');
    // params.set('quantity', '10');
    // params.set('price', '0.5');
    // params.set('recvWindow', '5000');
    params.set('timestamp', String(Date.now()));
    const paramsAsString = this.getParamsAsString(params);
    const signature = this.sign(paramsAsString);
    params.set('signature', signature);

    url = this.addParameters(url, params);
    this.logger.log(`url: ${url}`);
    const headers = { 'X-MEXC-APIKEY': process.env.ACCESS_KEY };
    const { data } = await this.externalCallerSvc.callExternal(
      Method.GET,
      url,
      null,
      headers,
    );
    this.logger.log(`data: ${JSON.stringify(data)}`);
    return null;
  }
  getParamsAsString(params: Map<string, string>): string {
    let paramsString = '';
    params.forEach((value, key) => {
      paramsString += key + '=' + value + '&';
    });
    return paramsString.slice(0, -1);
  }
  private addParameters(url: string, params: Map<string, string>): string {
    for (const [key, value] of params) {
      if (url.includes(key)) {
        continue;
      }
      if (url.includes('?')) {
        url += `&${key}=${value}`;
      } else {
        url += `?${key}=${value}`;
      }
    }
    return url;
  }

  private sign(paramsAsString: string): string {
    console.log(`paramsAsString: ${paramsAsString}`);
    const hash = CryptoJS.HmacSHA256(
      paramsAsString,
      '45d0b3c26f2644f19bfb98b07741b2f5',
    );
    console.log(`hash: ${hash}`);

    const signature = CryptoJS.HmacSHA256(
      paramsAsString,
      process.env.SECRET_KEY,
    );

    return signature.toString();
  }

  async getSymbol(pair: Pair): Promise<void> {
    const mexcBaseUrl = 'https://www.mexc.com/open/api/v2/market/symbols';
    const { data } = await this.externalCallerSvc.callExternal(
      Method.GET,
      mexcBaseUrl,
      null,
    );
    this.logger.log(`pair: ${JSON.stringify(pair)}`);
    for (const item of data) {
      if (
        item.symbol.includes(pair.token1) &&
        item.symbol.includes(pair.token2)
      ) {
        this.logger.log(`item: ${JSON.stringify(item)}`);
        break;
      }
    }
  }
}

// 'symbol=BTCUSDT&side=BUY&type=LIMIT&quantity=1&price=11&recvWindow=5000&timestamp=1644489390087&signature=c956706e2fa27d113ec1b02e5d5433eb6056a91d1d424180edfa8444bcc4d1c7
// 'symbol=BTCUSDT&side=BUY&type=LIMIT&quantity=1&price=11&recvWindow=5000&timestamp=1644489390087&signature=323c96ab85a745712e95e63cad28903dd8292e4a905e99c4ee3932023843a117
