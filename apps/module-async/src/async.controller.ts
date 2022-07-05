import { AsyncCall } from '@model/async';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AsyncSvc } from './async.service';

@Controller('asyncs')
export class AsyncController {
  constructor(
    @InjectModel('Async') private readonly asyncModel: Model<AsyncCall>,
    private readonly asyncSvc: AsyncSvc,
  ) {}

  @Get('all')
  async getAllAsync(): Promise<Array<AsyncCall>> {
    return this.asyncSvc.findAll();
  }

  @Get(':id')
  async getAsyncById(@Param() { id }: { id: string }): Promise<AsyncCall> {
    return this.asyncSvc.findById(id);
  }

  @Post()
  async createAsync(@Body() asyncCall: AsyncCall): Promise<AsyncCall> {
    return this.asyncSvc.create(asyncCall);
  }

  @Put()
  async modifyAsync(@Body() asyncCall: AsyncCall): Promise<AsyncCall> {
    return this.asyncSvc.modify(asyncCall);
  }

  @Delete('all')
  async deleteAllAsync(): Promise<void> {
    return this.asyncSvc.deleteAll();
  }
  @Delete(':id')
  async deleteAsync(@Param() { id }: { id: string }): Promise<AsyncCall> {
    return this.asyncSvc.delete(id);
  }
}
