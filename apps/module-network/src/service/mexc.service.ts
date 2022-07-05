import { Injectable } from '@nestjs/common';
import { createCustomLogger, ExternalCallerSvc, Method } from '@app/core';
import { MexcOrder, mexcOrderToOrder, Order, PriceType } from '@model/order';
import * as CryptoJS from 'crypto-js';
import { Pair, Price } from '@model/common';
import { Exchange, ExchangeStatus } from '@model/network';
import { ExchangeSvc } from './exchange.service';
import winston from 'winston';
import { moduleName } from '../main';

@Injectable()
export class MexcSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, MexcSvc.name);
  private readonly mexcBaseUrl = 'https://api.mexc.com';
  constructor(private readonly externalCallerSvc: ExternalCallerSvc, private readonly exchangeSvc: ExchangeSvc) {}

  async getActiveOrders(pair: Pair): Promise<Array<Order>> {
    const url = this.mexcBaseUrl + '/api/v3/openOrders';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    params.set('timestamp', String(Date.now()));
    const fullUrl = this.signUrl(url, params);
    this.logger.debug(`Sending request to ${fullUrl}`);
    const mexcOrders: MexcOrder[] = await this.send(Method.GET, fullUrl);
    return mexcOrders.map((mexcOrder) => mexcOrderToOrder(mexcOrder, pair));
  }

  async getPrice(pair: Pair): Promise<Price> {
    const url = this.mexcBaseUrl + '/api/v3/ticker/price';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    return await this.send(Method.GET, this.addParameters(url, params));
  }
  async postOrders(orders: Order[]): Promise<Exchange[]> {
    const createdOrderExchanges: Exchange[] = [];
    for (const order of orders) {
      const exchange = await this.sendOrder(order);
      createdOrderExchanges.push(exchange);
    }
    return createdOrderExchanges;
  }

  private async sendOrder(order: Order): Promise<Exchange> {
    const url = this.mexcBaseUrl + '/api/v3/order';
    const params: Map<string, string> = new Map();
    params.set('symbol', order.pair.token1 + order.pair.token2);
    params.set('side', order.side);
    params.set('type', order.price.type);
    if (order.price.type === PriceType.MARKET) {
      params.set('quoteOrderQty', String(order.amount));
    } else {
      params.set('price', String(order.price.value));
      params.set('quantity', String(Math.round((1000000 * order.amount) / order.price.value) / 1000000));
    }
    params.set('newClientOrderId', order._id);
    params.set('timestamp', String(Date.now()));
    const fullUrl = this.signUrl(url, params);
    const exchange = new Exchange();
    exchange.status = ExchangeStatus.PENDING;
    exchange.date = new Date();
    exchange.url = fullUrl;
    // save exchange before sending order
    const createcexchange = await this.exchangeSvc.create(exchange);
    const content = await this.send(Method.POST, fullUrl);
    createcexchange.content = content;
    createcexchange.status = ExchangeStatus.ACCEPTED;
    return await this.exchangeSvc.update(createcexchange);
  }

  getParamsAsString(params: Map<string, string>): string {
    let paramsString = '';
    params.forEach((value, key) => {
      paramsString += key + '=' + value + '&';
    });
    return paramsString.slice(0, -1);
  }

  signUrl(url: string, params: Map<string, string>): string {
    const paramsAsString = this.getParamsAsString(params);
    const signature = this.getSignature(paramsAsString);
    params.set('signature', signature);
    return this.addParameters(url, params);
  }

  async send(method: Method, url: string): Promise<any> {
    const headers = { 'X-MEXC-APIKEY': process.env.ACCESS_KEY };
    const { data } = await this.externalCallerSvc.callExternal(method, url, null, headers);
    this.logger.verbose(`Response data: ${JSON.stringify(data)}`);
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

  private getSignature(paramsAsString: string): string {
    const signature = CryptoJS.HmacSHA256(paramsAsString, process.env.SECRET_KEY);
    return signature.toString();
  }
}
