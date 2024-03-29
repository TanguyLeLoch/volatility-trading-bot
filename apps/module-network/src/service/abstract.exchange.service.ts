import { Balance } from '@model/balance';
import { Pair, Platform, Price, Utils } from '@model/common';
import {
  CexAccountInformation,
  CexBalance,
  cexBalanceToBalance,
  CexOrder,
  cexOrderToOrder,
  CexSymbolInfoResponse,
  Exchange,
  ExchangeStatus,
} from '@model/network';
import { Order, OrderStatus, PriceType } from '@model/order';
import { createCustomLogger, ExternalCallerSvc, Method } from '@app/core';
import { ExchangeSvc } from './exchange.service';
import winston from 'winston';
import * as CryptoJS from 'crypto-js';
import { moduleName } from '../module.info';
import { ExternalCallback } from '@app/core/caller/external.callback';
import { PairInfo } from '../PairInfo/pair.info';
import { PairInfoRepository } from '../PairInfo/pair.info.repository';
import { PairInfoMapper } from '../PairInfo/pair.info.mapper';

export abstract class AbstractExchangeSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, AbstractExchangeSvc.name);

  protected constructor(
    private readonly externalCallerSvc: ExternalCallerSvc,
    private readonly exchangeSvc: ExchangeSvc,
    private readonly pairInfoRepository: PairInfoRepository,
  ) {}

  abstract getHeaders(): object;

  abstract getPrivateKey(): string;

  abstract getBaseUrl(): string;

  abstract getPlatform(): Platform;

  getOtherMandatoryLimitPriceOrderParams(): Map<string, string> {
    return new Map();
  }

  async getActiveOrders(pair: Pair): Promise<Order[]> {
    const callbacks: ExternalCallback = new ExternalCallback(3);
    callbacks.addCallback(400, () => this.getActiveOrdersWithCallBack(pair, callbacks));
    const cexOrders: CexOrder[] = await this.getActiveOrdersWithCallBack(pair, callbacks);
    return cexOrders.map((cexOrder) => cexOrderToOrder(cexOrder, pair));
  }

  async getActiveOrdersWithCallBack(pair: Pair, callbacks: ExternalCallback): Promise<CexOrder[]> {
    const url = this.getBaseUrl() + '/api/v3/openOrders';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    params.set('timestamp', String(Date.now()));
    const fullUrl = this.signUrl(url, params);
    this.logger.verbose(`Sending request to ${fullUrl}`);
    return await this.send(Method.GET, fullUrl, callbacks);
    // return cexOrders.map((cexOrder) => cexOrderToOrder(cexOrder, pair));
  }

  async getOrderById(orderDb: Order): Promise<Order> {
    const url = this.getBaseUrl() + '/api/v3/order';
    const params: Map<string, string> = new Map();
    params.set('symbol', orderDb.pair.token1 + orderDb.pair.token2);
    params.set('timestamp', String(Date.now()));
    params.set('origClientOrderId', <string>orderDb._id);
    const fullUrl = this.signUrl(url, params);
    this.logger.debug(`Sending request to ${fullUrl}`);
    let orderCex: Order;
    try {
      const cexOrder: CexOrder = await this.send(Method.GET, fullUrl);
      orderCex = cexOrderToOrder(cexOrder, orderDb.pair);
    } catch (error) {
      this.logger.error(`Error getting order ${error}`);
      throw error;
    }
    return orderCex;
  }

  async getPrice(pair: Pair): Promise<Price> {
    const url = this.getBaseUrl() + '/api/v3/ticker/price';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    return await this.send(Method.GET, AbstractExchangeSvc.addParameters(url, params));
  }

  async getBalances(): Promise<Balance[]> {
    const url = this.getBaseUrl() + '/api/v3/account';
    const params: Map<string, string> = new Map();
    params.set('timestamp', String(Date.now()));
    const fullUrl = this.signUrl(url, params);
    this.logger.debug(`Sending request to ${fullUrl}`);
    const accountInfos: CexAccountInformation = await this.send(Method.GET, fullUrl);
    if (accountInfos) {
      const balances: Balance[] = accountInfos.balances.map((balance: CexBalance) =>
        cexBalanceToBalance(balance, this.getPlatform()),
      );
      this.logger.verbose(`Balances: ${JSON.stringify(balances)}`);
      return balances;
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
    const pairInfo: PairInfo = await this.getPairInfo(order.pair);

    if (order.price.type === PriceType.MARKET) {
      if (pairInfo.isMarketTypeSupported()) {
        this.logger.info(`Token ${order.pair.token1} is available to market order`);
        params.set('type', PriceType.MARKET);
        params.set('quoteOrderQty', String(order.amount));
      } else {
        this.logger.warn(`Token ${order.pair.token1} is not available to market order set LIMIT order instead`);
        needToWait = true;
        params.set('type', PriceType.LIMIT);
        const { price: currentPrice } = await this.getPrice(order.pair);
        AbstractExchangeSvc.setPriceForLimitOrder(params, currentPrice * 1.01, order.amount, pairInfo);
        if (process.env.ENV !== 'prod') {
          params.set('isMarket', 'true');
        }
      }
    } else {
      for (const [key, value] of this.getOtherMandatoryLimitPriceOrderParams()) {
        params.set(key, value);
      }
      params.set('type', order.price.type);
      const orderPriceValue: number | undefined = order.price.value;
      if (orderPriceValue === undefined) {
        throw new Error('Price value is undefined');
      }
      params.set('price', String(order.price.value));

      AbstractExchangeSvc.setPriceForLimitOrder(params, orderPriceValue, order.amount, pairInfo);
    }
    params.set('newClientOrderId', <string>order._id);
    params.set('timestamp', String(Date.now()));
    console.log('params', params);
    const fullUrl = this.signUrl(url, params);
    const exchange = new Exchange();
    exchange.status = ExchangeStatus.PENDING;
    exchange.date = new Date();
    exchange.url = fullUrl;
    console.log('fullUrl', fullUrl);

    // save exchange before sending order
    const createdExchange = await this.exchangeSvc.create(exchange);
    this.logger.warn(
      `Send Order ${params.get('side')} ${order.pair.token1} for ${order.amount} ${order.pair.token2} at ${
        params.get('price') ? params.get('price') + ' ' : ''
      }at ${params.get('type')}}`,
    );
    const content = await this.send(Method.POST, fullUrl);
    if (needToWait) {
      await this.waitMarketLimitOrderToBeTriggered(order);
    }

    createdExchange.content = content;
    createdExchange.status = ExchangeStatus.ACCEPTED;
    return await this.exchangeSvc.update(createdExchange);
  }

  private getPostOrderUrl(): string {
    if (process.env.ENV === 'dev') {
      return this.getBaseUrl() + '/api/v3/order/test';
    } else if (process.env.ENV === 'prod') {
      return this.getBaseUrl() + '/api/v3/order';
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
        this.logger.info(`Market order is fulfilled`);
        break;
      }
      this.logger.info(`LimitMarket order is not fulfilled yet, wait for 10 seconds`);
      await Utils.sleep(10000);
      nbSeconds++;
      if (nbSeconds > 600) {
        throw new Error('LimitMarket order is not fulfilled after 10 minutes');
      }
    }
    return orderCex;
  }

  public async getPairInfo(pair: Pair): Promise<PairInfo> {
    let pairInfo = await this.pairInfoRepository.find(pair, this.getPlatform());
    if (!(pairInfo === null || pairInfo.isExpired())) {
      return pairInfo;
    }
    this.logger.info(`PairInfo for ${pair} on ${this.getPlatform()} is ${pairInfo === null ? 'null' : 'expired'}`);
    pairInfo = await this.callExternalPairInfo(pair);
    pairInfo = await this.pairInfoRepository.save(pairInfo);
    return pairInfo;
  }

  private async callExternalPairInfo(pair: Pair): Promise<PairInfo> {
    const url = this.getBaseUrl() + '/api/v3/exchangeInfo';
    const params: Map<string, string> = new Map();
    params.set('symbol', pair.token1 + pair.token2);
    const symbolInfo: CexSymbolInfoResponse = await this.send(
      Method.GET,
      AbstractExchangeSvc.addParameters(url, params),
    );
    return PairInfoMapper.toPairInfoFromCex(symbolInfo, this.getPlatform());
  }

  static getParamsAsString(params: Map<string, string>): string {
    let paramsString = '';
    params.forEach((value, key) => {
      paramsString += key + '=' + value + '&';
    });
    return paramsString.slice(0, -1);
  }

  signUrl(url: string, params: Map<string, string>): string {
    const paramsAsString = AbstractExchangeSvc.getParamsAsString(params);
    const signature = this.getSignature(paramsAsString);
    params.set('signature', signature);
    return AbstractExchangeSvc.addParameters(url, params);
  }

  async send(method: Method, url: string, callbacks?: ExternalCallback): Promise<any> {
    const headers = this.getHeaders();
    const data = await this.externalCallerSvc.callExternal(method, url, undefined, headers, callbacks);
    this.logger.debug(`Response data: ${JSON.stringify(data)}`);
    return data;
  }

  private static addParameters(url: string, params: Map<string, string>): string {
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
    const privateKey = this.getPrivateKey();
    if (!privateKey) {
      throw new Error('PRIVATE_KEY_NOT_FOUND');
    }
    const signature = CryptoJS.HmacSHA256(paramsAsString, privateKey);
    return signature.toString();
  }

  private static setPriceForLimitOrder(
    params: Map<string, string>,
    price: number,
    amount: number,
    pairInfo: PairInfo,
  ): void {
    params.set('price', String(price));
    const quantity = Math.round(amount / pairInfo.StepSize / price) / Math.round(1 / pairInfo.StepSize);
    params.set('quantity', quantity.toString());
  }
}
