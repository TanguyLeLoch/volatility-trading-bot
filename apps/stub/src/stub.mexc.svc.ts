import { createCustomLogger } from '@app/core';
import { MexcBalance } from '@model/balance';
import { MexcOrder, OrderStatus, PriceType, Side } from '@model/order';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { moduleName } from './module.info';

const mapPair = {
  AZEROUSDT: ['AZERO', 'USDT'],
};

@Injectable()
export class StubMexcSvc {
  private readonly logger = createCustomLogger(moduleName, StubMexcSvc.name);
  constructor(
    @InjectModel('MexcOrder') private readonly mexcOrderModel: Model<MexcOrder>,
    @InjectModel('MexcBalance') private readonly mexcBalanceModel: Model<MexcBalance>,
  ) {}

  async getOpenOrders(symbol: string): Promise<MexcOrder[]> {
    const orders: MexcOrder[] = await this.mexcOrderModel.find({ symbol }).exec();
    return orders.filter((order) => ![OrderStatus.CANCELLED, OrderStatus.FILLED].includes(order.status));
  }
  async getOrderByClientId(origClientOrderId: string): Promise<MexcOrder> {
    return await this.mexcOrderModel.findOne({ clientOrderId: origClientOrderId }).exec();
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
  }): Promise<MexcOrder> {
    const order: MexcOrder = new MexcOrder();
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
    const [balanceToken, balanceBase] = await this.getBalancesBySymbol(symbol);
    if (type === PriceType.MARKET || Boolean(isMarket)) {
      order.status = OrderStatus.FILLED;
      if (side === Side.BUY) {
        const qty = Number(quantity);
        balanceToken.free = String(Number(balanceToken.free) + qty);
        balanceBase.free = String(Number(balanceBase.free) - (qty * priceNumber) / 1.01);
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
    return await this.mexcOrderModel.create(order);
  }

  // @Transactional()
  async fillOrder(clientOrderId: string): Promise<MexcOrder> {
    const orderToFill: MexcOrder = await this.mexcOrderModel.findOne({ clientOrderId }).exec();
    orderToFill.status = OrderStatus.FILLED;
    const orderFilled = await this.mexcOrderModel
      .findOneAndUpdate({ clientOrderId }, orderToFill, { new: true })
      .exec();
    const qty = Number(orderToFill.origQty);
    const price = Number(orderToFill.price);
    const [balanceToken, balanceBase] = await this.getBalancesBySymbol(orderToFill.symbol);
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

  async getBalance(asset: string): Promise<MexcBalance> {
    return await this.mexcBalanceModel.findOne({ asset }).exec();
  }

  async updateBalance(mexcBalance: MexcBalance): Promise<MexcBalance> {
    const balanceUpdated = await this.mexcBalanceModel
      .findOneAndUpdate({ asset: mexcBalance.asset }, mexcBalance, { new: true })
      .exec();
    return balanceUpdated;
  }

  async createBalance(mexcBalance: MexcBalance): Promise<MexcBalance> {
    const balanceCreated = await this.mexcBalanceModel.create(mexcBalance);
    return balanceCreated;
  }
  async getBalances(): Promise<MexcBalance[]> {
    const balances: MexcBalance[] = await this.mexcBalanceModel.find({}).exec();
    return balances;
  }

  private async getBalancesBySymbol(symbol: string): Promise<MexcBalance[]> {
    const pair: string[] = mapPair[symbol];
    if (!pair) {
      throw new Error(`Pair ${symbol} not found`);
    }
    const balanceToken: MexcBalance = await this.getBalance(pair[0]);
    const balanceBase: MexcBalance = await this.getBalance(pair[1]);
    return [balanceToken, balanceBase];
  }
  deleteAllOrders(): void {
    this.mexcOrderModel.deleteMany({}).exec();
  }
  deleteOrder(clientOrderId: string): void {
    this.mexcOrderModel.deleteOne({ clientOrderId }).exec();
  }
  deleteAllBalances(): void {
    this.mexcBalanceModel.deleteMany({}).exec();
  }
  deleteBalance(asset: string): void {
    this.mexcBalanceModel.deleteOne({ asset }).exec();
  }
}

function checkPositivity(mexcBalances: MexcBalance[]) {
  mexcBalances.forEach((balance) => {
    if (Number(balance.free) < 0 || Number(balance.locked) < 0) {
      throw new Error(`Balance ${balance.asset} has negative value`);
    }
  });
}
