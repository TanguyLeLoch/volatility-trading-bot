import { Injectable, Logger } from '@nestjs/common';
import { ExternalCallerSvc, Method } from '@app/core';
import { Order } from '@model/order';
import * as CryptoJS from 'crypto-js';
import { Pair } from '@model/common';

@Injectable()
export class MexcSvc {
  private readonly logger = new Logger(MexcSvc.name);
  private readonly mexcBaseUrl = 'https://api.mexc.com';
  constructor(private readonly externalCallerSvc: ExternalCallerSvc) {}

  async getActiveOrders(pair: Pair): Promise<Order> {
    const url = this.mexcBaseUrl + '/api/v3/openOrders';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    params.set('timestamp', String(Date.now()));
    return this.signAndSend(Method.GET, url, params);
  }

  getParamsAsString(params: Map<string, string>): string {
    let paramsString = '';
    params.forEach((value, key) => {
      paramsString += key + '=' + value + '&';
    });
    return paramsString.slice(0, -1);
  }

  async signAndSend(
    method: Method,
    url: string,
    params: Map<string, string>,
  ): Promise<any> {
    const paramsAsString = this.getParamsAsString(params);
    const signature = this.sign(paramsAsString);
    params.set('signature', signature);
    const fullUrl = this.addParameters(url, params);
    this.logger.log(`url: ${fullUrl}`);
    const headers = { 'X-MEXC-APIKEY': process.env.ACCESS_KEY };
    const { data } = await this.externalCallerSvc.callExternal(
      method,
      fullUrl,
      null,
      headers,
    );
    this.logger.log(`data: ${JSON.stringify(data)}`);
    return data;
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
    const signature = CryptoJS.HmacSHA256(
      paramsAsString,
      process.env.SECRET_KEY,
    );
    return signature.toString();
  }
}
