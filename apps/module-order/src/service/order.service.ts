import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Order } from '@model/order';

@Injectable()
export class OrderSvc {
  constructor(
    @InjectModel('Order') private readonly orderModel: Model<Order>,
  ) {}

  async findById(id: string): Promise<Order> {
    return this.orderModel.findById(id).exec();
  }

  async modify(order: Order): Promise<Order> {
    return this.orderModel
      .findByIdAndUpdate(order._id, order, { new: true })
      .exec();
  }

  async findAll(): Promise<Array<Order>> {
    return this.orderModel.find().exec();
  }

  async create(order: Order): Promise<Order> {
    const createdOrder = new this.orderModel(order);
    return createdOrder.save();
  }

  async delete(id: string): Promise<Order> {
    return this.orderModel.findByIdAndDelete(id).exec();
  }
}
