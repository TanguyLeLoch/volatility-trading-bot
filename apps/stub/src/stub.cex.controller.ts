import { Platform, Price } from '@model/common';
import { PriceType, Side } from '@model/order';
import { Controller, Delete, Get, Headers, Param, Post, Query } from '@nestjs/common';
import { StubCexSvc } from './stub.cex.svc';
import { CexAccountInformation, CexBalance, CexOrder, CexSymbolInfoResponse } from '@model/network';
import { createCustomLogger } from '@app/core';
import { moduleName } from './module.info';

@Controller()
export class StubCexController {
  private readonly logger = createCustomLogger(moduleName, StubCexController.name);

  constructor(private readonly stubMexcSvc: StubCexSvc) {}

  @Delete('orders/:id')
  deleteOrder(@Param('id') id: string): void {
    this.logger.debug(`delete order ${id}`);
    if (id === 'all') {
      return this.stubMexcSvc.deleteAllOrders();
    }
    return this.stubMexcSvc.deleteOrder(id);
  }

  @Delete('balances/:id')
  deleteBalance(@Param('id') id: string): void {
    this.logger.debug(`delete balance ${id}`);
    if (id === 'all') {
      return this.stubMexcSvc.deleteAllBalances();
    }
    return this.stubMexcSvc.deleteBalance(id);
  }

  @Get('api/v3/ticker/price?')
  getPrice(@Query('symbol') symbol: string): Price {
    this.logger.debug(`get price for ${symbol}`);
    return this.stubMexcSvc.getPrice(symbol);
  }

  @Get('api/v3/exchangeInfo?')
  async getInfo(
    @Query('symbol') symbol: string,
    @Headers('platform') platform: Platform,
  ): Promise<CexSymbolInfoResponse> {
    return this.stubMexcSvc.getInfo(symbol, platform);
  }

  @Post('api/v3/order/test?')
  postOrder(
    @Query('symbol') symbol: string,
    @Query('side') side: Side,
    @Query('type') type: PriceType,
    @Query('quantity') quantity: string,
    @Query('price') price: string,
    @Query('newClientOrderId') newClientOrderId: string,
    @Query('timestamp') timestamp: string,
    @Query('quoteOrderQty') quoteOrderQty: string,
    @Query('isMarket') isMarket: string,
    @Headers('platform') platform: string,
  ): Promise<CexOrder> {
    this.logger.debug(`post order ${newClientOrderId}`);
    return this.stubMexcSvc.createOrder({
      symbol,
      side,
      type,
      price,
      quantity,
      newClientOrderId,
      timestamp,
      quoteOrderQty,
      isMarket,
      platform,
    });
  }

  @Get('api/v3/order?')
  getOrders(@Query('origClientOrderId') origClientOrderId: string): Promise<CexOrder> {
    this.logger.debug(`get order ${origClientOrderId}`);
    return this.stubMexcSvc.getOrderByClientId(origClientOrderId);
  }

  @Get('api/v3/openOrders?')
  openOrder(@Query('symbol') symbol: string): Promise<CexOrder[]> {
    this.logger.debug(`open order ${symbol}`);
    return this.stubMexcSvc.getOpenOrders(symbol);
  }

  @Get('api/v3/account?')
  async getAccount(@Headers('platform') platform: string): Promise<CexAccountInformation> {
    this.logger.debug(`get account ${platform}`);
    return {
      makerCommission: 20,
      takerCommission: 20,
      buyerCommission: 0,
      sellerCommission: 0,
      canTrade: true,
      canWithdraw: true,
      canDeposit: true,
      updateTime: null,
      accountType: 'SPOT',
      permissions: ['SPOT'],
      balances: await this.stubMexcSvc.getBalances(platform),
    };
  }

  @Post('triggerOrder/:clientId')
  triggerOrder(@Param('clientId') clientId: string): Promise<CexOrder> {
    this.logger.debug(`trigger order ${clientId}`);
    return this.stubMexcSvc.fillOrder(clientId);
  }

  @Post('balances?')
  async postBalance(
    @Query('asset') asset: string,
    @Query('quantity') quantity: string,
    @Query('platform') platform: string,
  ): Promise<CexBalance> {
    this.logger.debug(`post balance ${asset} ${quantity} ${platform}`);
    const balance: CexBalance = await this.stubMexcSvc.getBalance(asset, platform);
    if (balance) {
      balance.free = String(parseFloat(balance.free) + parseFloat(quantity));
      return this.stubMexcSvc.updateBalance(balance);
    } else {
      const balanceToCreate: CexBalance = new CexBalance();
      balanceToCreate.asset = asset;
      balanceToCreate.free = quantity;
      balanceToCreate.locked = '0';
      balanceToCreate.platform = platform;
      return this.stubMexcSvc.createBalance(balanceToCreate);
    }
  }
}
