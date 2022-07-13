import { Balance } from '@model/balance';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class BalanceSvc {
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
}
