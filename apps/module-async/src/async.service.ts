import { AsyncCall, AsyncFilter } from '@model/async';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class AsyncSvc {
  constructor(@InjectModel('Async') private readonly asyncModel: Model<AsyncCall>) {}

  async findById(id: string): Promise<AsyncCall> {
    return this.asyncModel.findById(id).exec();
  }

  async modify(asyncCall: AsyncCall): Promise<AsyncCall> {
    return this.asyncModel.findByIdAndUpdate(asyncCall._id, asyncCall, { new: true }).exec();
  }

  async findAll(): Promise<Array<AsyncCall>> {
    return this.asyncModel.find().exec();
  }
  async findWithFilter(filter: AsyncFilter): Promise<Array<AsyncCall>> {
    const filterForMongoose = {} as any;
    if (filter.status) {
      filterForMongoose.status = filter.status;
    }
    if (filter.dateToCallLessThan) {
      filterForMongoose.dateToCall = {} as any;
      filterForMongoose.dateToCall.$lt = filter.dateToCallLessThan;
    }

    return this.asyncModel.find(filterForMongoose).exec();
  }
  async create(asyncCall: AsyncCall): Promise<AsyncCall> {
    const createdAsyncCall = new this.asyncModel(asyncCall);
    return createdAsyncCall.save();
  }

  async delete(id: string): Promise<AsyncCall> {
    return this.asyncModel.findByIdAndDelete(id).exec();
  }
  async deleteAll(): Promise<void> {
    await this.asyncModel.deleteMany({}).exec();
  }
}
