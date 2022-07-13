import { createCustomLogger } from '@app/core';
import { Exchange } from '@model/network';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import winston from 'winston';
import { moduleName } from '../module.info';

@Injectable()
export class ExchangeSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, ExchangeSvc.name);
  constructor(@InjectModel('Exchange') private readonly exchangeModel: Model<Exchange>) {}

  async findById(id: string): Promise<Exchange> {
    return this.exchangeModel.findById(id).exec();
  }

  async create(exchange: Exchange): Promise<Exchange> {
    const exchangeToCreate = new this.exchangeModel(exchange);
    return await exchangeToCreate.save();
  }
  async update(exchange: Exchange): Promise<Exchange> {
    return await this.exchangeModel
      .findByIdAndUpdate(exchange._id, exchange, {
        new: true,
      })
      .exec();
  }

  async deleteAll(): Promise<void> {
    await this.exchangeModel.deleteMany({}).exec();
  }
  async findAll(): Promise<Array<Exchange>> {
    return await this.exchangeModel.find().exec();
  }
}
