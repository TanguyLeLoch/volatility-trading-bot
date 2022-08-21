import { MexcBalance } from '@model/balance';
import { Price } from '@model/common';
import { AccountInformation, SymbolInfoResponse } from '@model/network';
import { MexcOrder, PriceType, Side } from '@model/order';
import { Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { StubMexcSvc } from './stub.mexc.svc';

@Controller()
export class StubMexcController {
  constructor(private readonly stubMexcSvc: StubMexcSvc) {}

  @Delete('orders/:id')
  deleteOrder(@Param('id') id: string): void {
    if (id === 'all') {
      return this.stubMexcSvc.deleteAllOrders();
    }
    return this.stubMexcSvc.deleteOrder(id);
  }
  @Delete('balances/:id')
  deleteBalance(@Param('id') id: string): void {
    if (id === 'all') {
      return this.stubMexcSvc.deleteAllBalances();
    }
    return this.stubMexcSvc.deleteBalance(id);
  }

  @Get('api/v3/ticker/price?')
  getPrice(@Query('symbol') symbol: string): Price {
    return {
      symbol,
      price: 1.2,
    };
  }
  @Get('api/v3/exchangeInfo?')
  getInfo(@Query('symbol') symbol: string): SymbolInfoResponse {
    const symbolInfos: SymbolInfoResponse = {
      timezone: 'CST',
      serverTime: 1660751941000,
      rateLimits: [],
      exchangeFilters: [],
      symbols: [
        {
          symbol,
          status: 'ENABLED',
          baseAsset: 'AZERO',
          baseAssetPrecision: 2,
          quoteAsset: 'USDT',
          quotePrecision: 4,
          quoteAssetPrecision: 4,
          baseCommissionPrecision: 2,
          quoteCommissionPrecision: 4,
          orderTypes: ['LIMIT', 'LIMIT_MAKER'],
          quoteOrderQtyMarketAllowed: false,
          isSpotTradingAllowed: true,
          isMarginTradingAllowed: true,
          quoteAmountPrecision: '5',
          baseSizePrecision: '0.01',
          permissions: ['SPOT', 'MARGIN'],
          filters: [],
          maxQuoteAmount: '5000000',
          makerCommission: '0.002',
          takerCommission: '0.002',
        },
      ],
    };
    if (symbol !== 'AZEROUSDT') {
      symbolInfos.symbols[0].orderTypes.push('MARKET');
    }
    return symbolInfos;
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
  ): Promise<MexcOrder> {
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
    });
  }

  @Get('api/v3/order?')
  getOrders(@Query('origClientOrderId') origClientOrderId: string): Promise<MexcOrder> {
    return this.stubMexcSvc.getOrderByClientId(origClientOrderId);
  }

  @Get('api/v3/openOrders?')
  openOrder(@Query('symbol') symbol: string): Promise<MexcOrder[]> {
    return this.stubMexcSvc.getOpenOrders(symbol);
  }
  @Get('api/v3/account?')
  async getAccount(): Promise<AccountInformation> {
    const infos: AccountInformation = {
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
      balances: await this.stubMexcSvc.getBalances(),
    };
    return infos;
  }

  @Post('triggerOrder/:clientId')
  triggerOrder(@Param('clientId') clientId: string): Promise<MexcOrder> {
    return this.stubMexcSvc.fillOrder(clientId);
  }

  @Post('balances?')
  async postBalance(@Query('asset') asset: string, @Query('quantity') quantity: string): Promise<MexcBalance> {
    const balance: MexcBalance = await this.stubMexcSvc.getBalance(asset);
    if (balance) {
      balance.free = String(parseFloat(balance.free) + parseFloat(quantity));
      return this.stubMexcSvc.updateBalance(balance);
    } else {
      const balanceTocreate: MexcBalance = new MexcBalance();
      balanceTocreate.asset = asset;
      balanceTocreate.free = quantity;
      balanceTocreate.locked = '0';
      return this.stubMexcSvc.createBalance(balanceTocreate);
    }
  }
}
