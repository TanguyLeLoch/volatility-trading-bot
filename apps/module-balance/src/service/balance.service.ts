import { createCustomLogger } from '@app/core';
import { Balance } from '@model/balance';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import winston from 'winston';
import { moduleName } from '../module.info';

@Injectable()
export class BalanceSvc {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, BalanceSvc.name);

  constructor(@InjectModel('Balance') private readonly balanceModel: Model<Balance>) {}

  async findById(id: string): Promise<Balance> {
    return this.balanceModel.findById(id).exec();
  }

  async modify(balance: Balance): Promise<Balance> {
    return this.balanceModel.findByIdAndUpdate(balance._id, balance, { new: true }).exec();
  }

  async findAll(): Promise<Array<Balance>> {
    return this.balanceModel.find().exec();
  }

  async create(balance: Balance): Promise<Balance> {
    const createdBalance = new this.balanceModel(balance);
    return createdBalance.save();
  }

  async delete(id: string): Promise<Balance> {
    return this.balanceModel.findByIdAndDelete(id).exec();
  }

  async createOrUpdate(balance: Balance): Promise<Balance> {
    const foundBalance = await this.balanceModel.findOne({ token: balance.token, platform: balance.platform }).exec();
    if (foundBalance) {
      this.logger.info(`found balance with id ${foundBalance._id}`);
      balance._id = foundBalance._id;
      return this.modify(balance);
    } else {
      return this.create(balance);
    }
  }

  async findByTokenAndPlatform(token: string, platform: string): Promise<Balance> {
    return this.balanceModel.findOne({ token: token, platform: platform }).exec();
  }

  async deleteAll(): Promise<void> {
    await this.balanceModel.deleteMany().exec();
  }
}
