import { Exchange } from '@model/network';
import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class ExchangeSvc {
  private readonly logger = new Logger(ExchangeSvc.name);
  constructor(
    @InjectModel('Exchange') private readonly orderModel: Model<Exchange>,
  ) {}

  async findById(id: string): Promise<Exchange> {
    return this.orderModel.findById(id).exec();
  }

  async create(exchange: Exchange): Promise<Exchange> {
    const exchangeToCreate = new this.orderModel(exchange);
    return await exchangeToCreate.save();
  }
  async update(exchange: Exchange): Promise<Exchange> {
    return await this.orderModel
      .findByIdAndUpdate(exchange._id, exchange, {
        new: true,
      })
      .exec();
  }
}
