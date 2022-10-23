import { createCustomLogger, Method, ModuleCallerSvc } from '@app/core';
import { Order, OrderStatus, PriceType, Side } from '@model/order';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { moduleName } from './module.info';
import { CexBalance, CexOrder } from '@model/network';
import { Plan } from '@model/plan';
import { Price } from '@model/common';

const mapPair = {
  AZEROUSDT: ['AZERO', 'USDT'],
  BTCBUSD: ['BTC', 'BUSD'],
};

@Injectable()
export class StubCexSvc {
  private readonly logger = createCustomLogger(moduleName, StubCexSvc.name);

  constructor(
    @InjectModel('CexOrder') private readonly cexOrderModel: Model<CexOrder>,
    @InjectModel('CexBalance') private readonly cexBalanceModel: Model<CexBalance>,
    private readonly moduleCallerSvc: ModuleCallerSvc,
  ) {}

  async getOpenOrders(symbol: string): Promise<CexOrder[]> {
    const orders: CexOrder[] = await this.cexOrderModel.find({ symbol }).exec();
    return orders.filter((order) => ![OrderStatus.CANCELLED, OrderStatus.FILLED].includes(order.status));
  }

  async getOrderByClientId(origClientOrderId: string): Promise<CexOrder> {
    return await this.cexOrderModel.findOne({ clientOrderId: origClientOrderId }).exec();
  }

  async createOrder({
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
  }: {
    symbol: string;
    side: Side;
    type: PriceType;
    price: string;
    quantity: string;
    newClientOrderId: string;
    timestamp: string;
    quoteOrderQty: string;
    isMarket: string;
    platform: string;
  }): Promise<CexOrder> {
    const order: CexOrder = new CexOrder();
    order.symbol = symbol;
    order.side = side;
    order.type = type;
    order.price = price;
    order.origQty = quantity;
    order.origQuoteOrderQty = quoteOrderQty;
    order.clientOrderId = newClientOrderId;
    order.time = Number(timestamp);
    order.status = OrderStatus.NEW;
    const qty = Number(quantity);
    const priceNumber = Number(price);
    const [balanceToken, balanceBase] = await this.getBalancesBySymbol(symbol, platform);
    if (type === PriceType.MARKET || Boolean(isMarket)) {
      order.status = OrderStatus.FILLED;
      if (side === Side.BUY) {
        const actualPrice: number = this.getPrice(symbol).price;
        const quantityBaseAsset = Number(quoteOrderQty);
        const quantityTokenAsset = quantityBaseAsset / actualPrice;
        balanceToken.free = String(Number(balanceToken.free) + quantityTokenAsset);
        balanceBase.free = String(Number(balanceBase.free) - quantityBaseAsset);
      } else {
        throw new Error('Not implemented');
      }
    } else {
      if (side === Side.BUY) {
        balanceBase.free = String(Number(balanceBase.free) - qty * priceNumber);
        balanceBase.locked = String(Number(balanceBase.locked) + qty * priceNumber);
      } else {
        balanceToken.free = String(Number(balanceToken.free) - qty);
        balanceToken.locked = String(Number(balanceToken.locked) + qty);
      }
    }
    const balanceUpd = await this.updateBalance(balanceToken);
    const balanceUpdBase = await this.updateBalance(balanceBase);
    checkPositivity([balanceUpd, balanceUpdBase]);
    return await this.cexOrderModel.create(order);
  }

  // @Transactional()
  async fillOrder(clientOrderId: string): Promise<CexOrder> {
    const orderToFill: CexOrder = await this.cexOrderModel.findOne({ clientOrderId }).exec();
    orderToFill.status = OrderStatus.FILLED;
    const orderFilled = await this.cexOrderModel.findOneAndUpdate({ clientOrderId }, orderToFill, { new: true }).exec();
    const qty = Number(orderToFill.origQty);
    const price = Number(orderToFill.price);
    const platform = await this.findPlatform(orderToFill);
    const [balanceToken, balanceBase] = await this.getBalancesBySymbol(orderToFill.symbol, platform);
    if (orderToFill.side === Side.BUY) {
      balanceToken.free = String(Number(balanceToken.free) + qty);
      balanceBase.locked = String(Number(balanceBase.locked) - qty * price);
    } else {
      balanceToken.locked = String(Number(balanceToken.locked) - qty);
      balanceBase.free = String(Number(balanceBase.free) + qty * price);
    }
    const balanceUpd = await this.updateBalance(balanceToken);
    const balanceUpdBase = await this.updateBalance(balanceBase);
    checkPositivity([balanceUpd, balanceUpdBase]);
    return orderFilled;
  }

  private async findPlatform(cexOrder: CexOrder) {
    const order: Order = await this.moduleCallerSvc.callOrderModule(
      Method.GET,
      `orders/${cexOrder.clientOrderId}`,
      null,
    );
    const plan: Plan = await this.moduleCallerSvc.callPlanModule(Method.GET, `plans/${order.planId}`, null);
    return plan.platform;
  }

  async getBalance(asset: string, platform: string): Promise<CexBalance> {
    return await this.cexBalanceModel.findOne({ asset, platform }).exec();
  }

  async updateBalance(cexBalance: CexBalance): Promise<CexBalance> {
    this.logger.debug(`Updating balance ${cexBalance.asset} ${cexBalance.platform}`);
    return await this.cexBalanceModel
      .findOneAndUpdate({ asset: cexBalance.asset, platform: cexBalance.platform }, cexBalance, { new: true })
      .exec();
  }

  async createBalance(cexBalance: CexBalance): Promise<CexBalance> {
    this.logger.debug(`Creating balance ${cexBalance.asset} ${cexBalance.platform}`);
    return await this.cexBalanceModel.create(cexBalance);
  }

  async getBalances(platform: string): Promise<CexBalance[]> {
    return await this.cexBalanceModel.find({ platform }).exec();
  }

  private async getBalancesBySymbol(symbol: string, platform: string): Promise<CexBalance[]> {
    const pair: string[] = mapPair[symbol];
    if (!pair) {
      throw new Error(`Pair ${symbol} not found`);
    }
    const balanceToken: CexBalance = await this.getBalance(pair[0], platform);
    const balanceBase: CexBalance = await this.getBalance(pair[1], platform);
    if (!balanceToken || !balanceBase) {
      throw new Error(`Balance not found for ${symbol}`);
    }
    return [balanceToken, balanceBase];
  }

  deleteAllOrders(): void {
    this.cexOrderModel.deleteMany({}).exec();
  }

  deleteOrder(clientOrderId: string): void {
    this.cexOrderModel.deleteOne({ clientOrderId }).exec();
  }

  deleteAllBalances(): void {
    this.cexBalanceModel.deleteMany({}).exec();
  }

  deleteBalance(asset: string): void {
    this.cexBalanceModel.deleteOne({ asset }).exec();
  }

  getPrice(symbol: string): Price {
    let price;
    switch (symbol) {
      case 'BTCBUSD':
        price = 18900;
        break;
      case 'AZEROUSDT':
        price = 1.2;
        break;
      default:
        price = 123;
    }
    return {
      symbol,
      price,
    };
  }
}

function checkPositivity(cexBalances: CexBalance[]) {
  cexBalances.forEach((balance) => {
    if (Number(balance.free) < 0 || Number(balance.locked) < 0) {
      throw new Error(`Balance ${balance.asset} has negative value`);
    }
  });
}
