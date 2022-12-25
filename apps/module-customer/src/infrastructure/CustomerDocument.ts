import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Customer } from '../domain/Customer';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class CustomerDocument {
  @Prop({
    type: mongoose.Types.ObjectId,
    required: true,
  })
  public readonly _id: string;
  @Prop({ required: true })
  public readonly name: string;
  @Prop({ required: true })
  public readonly email: string;

  constructor(_id: string, name: string, email: string) {
    this._id = _id;
    this.name = name;
    this.email = email;
  }

  static fromCustomer(customer: Customer): CustomerDocument {
    return new CustomerDocument(customer.id, customer.name, customer.email);
  }

  toCustomer(): Customer {
    return new Customer(this._id, this.name, this.email);
  }
}

export const CustomerSchema = SchemaFactory.createForClass(CustomerDocument);
// create Index
CustomerSchema.index({ email: 1 }, { unique: true });
