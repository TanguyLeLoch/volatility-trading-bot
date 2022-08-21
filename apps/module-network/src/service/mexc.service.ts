import { createCustomLogger, ExternalCallerSvc, Method } from '@app/core';
import { Balance, MexcBalance, mexcBalanceToBalance } from '@model/balance';
import { Pair, Price, Utils } from '@model/common';
import { AccountInformation, Exchange, ExchangeStatus, SymbolInfoResponse } from '@model/network';
import { MexcOrder, mexcOrderToOrder, Order, OrderStatus, PriceType } from '@model/order';
import { Injectable } from '@nestjs/common';
import * as CryptoJS from 'crypto-js';
import winston from 'winston';
import { moduleName } from '../module.info';
import { AbstractExchangeSvc } from './AbstractExchangeSvc';
import { ExchangeSvc } from './exchange.service';

@Injectable()
export class MexcSvc extends AbstractExchangeSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, MexcSvc.name);
  private readonly mexcBaseUrl = process.env.ENV === 'prod' ? 'https://api.mexc.com' : 'http://localhost:43000';
  constructor(private readonly externalCallerSvc: ExternalCallerSvc, private readonly exchangeSvc: ExchangeSvc) {
    super();
  }

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
  async getOrderById(orderDb: Order): Promise<Order> {
    const url = this.mexcBaseUrl + '/api/v3/order';
    const params: Map<string, string> = new Map();
    params.set('symbol', orderDb.pair.token1 + orderDb.pair.token2);
    params.set('timestamp', String(Date.now()));
    params.set('origClientOrderId', orderDb._id);
    const fullUrl = this.signUrl(url, params);
    this.logger.debug(`Sending request to ${fullUrl}`);
    let orderCex: Order;

    try {
      const mexcOrder: MexcOrder = await this.send(Method.GET, fullUrl);
      orderCex = mexcOrderToOrder(mexcOrder, orderDb.pair);
    } catch (e) {
      this.logger.error(`Error getting order ${e}`);
    }
    return orderCex;
  }

  async getPrice(pair: Pair): Promise<Price> {
    const url = this.mexcBaseUrl + '/api/v3/ticker/price';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    return await this.send(Method.GET, this.addParameters(url, params));
  }
  async getBalances(): Promise<Balance[]> {
    const url = this.mexcBaseUrl + '/api/v3/account';
    const params: Map<string, string> = new Map();
    params.set('timestamp', String(Date.now()));
    const fullUrl = this.signUrl(url, params);
    this.logger.debug(`Sending request to ${fullUrl}`);
    const accountInfos: AccountInformation = await this.send(Method.GET, fullUrl);
    if (accountInfos) {
      return accountInfos.balances.map((balance: MexcBalance) => mexcBalanceToBalance(balance));
    }
    return [];
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
    const url = this.getPostOrderUrl();
    const params: Map<string, string> = new Map();
    params.set('symbol', order.pair.token1 + order.pair.token2);
    params.set('side', order.side);
    let needToWait = false;
    if (order.price.type === PriceType.MARKET) {
      if (await this.isTokenAvailableToMarketOrder(order.pair)) {
        this.logger.info(`Token ${order.pair.token1} is available to market order`);
        params.set('type', PriceType.MARKET);
        params.set('quoteOrderQty', String(order.amount));
      } else {
        this.logger.warn(`Token ${order.pair.token1} is not available to market order set LIMIT order instead`);
        needToWait = true;
        params.set('type', PriceType.LIMIT);
        const { price: currentprice } = await this.getPrice(order.pair);
        this.setPriceForLimitOrder(params, currentprice * 1.01, order.amount);
        if (process.env.ENV !== 'prod') {
          params.set('isMarket', 'true');
        }
      }
    } else {
      params.set('type', order.price.type);
      params.set('price', String(order.price.value));
      params.set('quantity', String(Math.round((1000000 * order.amount) / order.price.value) / 1000000));
      this.setPriceForLimitOrder(params, order.price.value, order.amount);
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
    this.logger.warn(
      `Send Order ${params.get('side')} ${order.amount} ${order.pair.token1} ${
        params.get('price') ? params.get('price') + ' ' : ''
      }at ${params.get('type')}}`,
    );
    const content = await this.send(Method.POST, fullUrl);
    if (needToWait) {
      await this.waitMarketLimitOrderToBeTriggered(order);
    }

    createcexchange.content = content;
    createcexchange.status = ExchangeStatus.ACCEPTED;
    return await this.exchangeSvc.update(createcexchange);
  }

  private getPostOrderUrl(): string {
    if (process.env.ENV === 'dev') {
      return this.mexcBaseUrl + '/api/v3/order/test';
    } else if (process.env.ENV === 'prod') {
      return this.mexcBaseUrl + '/api/v3/order';
    }
    throw new Error('INVALID_ENV');
  }

  async waitMarketLimitOrderToBeTriggered(order: Order): Promise<Order> {
    this.logger.info(`Wait for market order to be filled`);
    let orderCex: Order;
    let nbSeconds = 0;
    while (true) {
      orderCex = await this.getOrderById(order);
      if (orderCex && orderCex.status === OrderStatus.FILLED) {
        this.logger.info(`Market order is fullfilled`);
        break;
      }
      this.logger.info(`LimitMarket order is not fullfilled yet, wait for 10 seconds`);
      await Utils.sleep(10000);
      nbSeconds++;
      if (nbSeconds > 600) {
        throw new Error('LimitMarket order is not fullfilled after 10 minutes');
      }
    }
    return orderCex;
  }

  async isTokenAvailableToMarketOrder(pair: Pair) {
    const url = this.mexcBaseUrl + '/api/v3/exchangeInfo';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    const symbolInfo: SymbolInfoResponse = await this.send(Method.GET, this.addParameters(url, params));
    const symbol = symbolInfo.symbols.find((symb) => symb.symbol === pair.token1 + pair.token2);
    return undefined !== symbol.orderTypes.find((orderType) => orderType === PriceType.MARKET);
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
  private setPriceForLimitOrder(params: Map<string, string>, price: number, amount: number): void {
    params.set('price', String(price));
    params.set('quantity', String(Utils.roundAmount(amount / price, 5)));
  }
}
