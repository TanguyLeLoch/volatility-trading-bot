import { AsyncCall } from '@model/async';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AsyncSvc {
  constructor(
    @InjectModel('Async') private readonly asyncModel: Model<AsyncCall>,
  ) {}

  async findById(id: string): Promise<AsyncCall> {
    return this.asyncModel.findById(id).exec();
  }

  async modify(asyncCall: AsyncCall): Promise<AsyncCall> {
    return this.asyncModel
      .findByIdAndUpdate(asyncCall._id, asyncCall, { new: true })
      .exec();
  }

  async findAll(): Promise<Array<AsyncCall>> {
    return this.asyncModel.find().exec();
  }

  async create(asyncCall: AsyncCall): Promise<AsyncCall> {
    const createdAsyncCall = new this.asyncModel(asyncCall);
    return createdAsyncCall.save();
  }
}
