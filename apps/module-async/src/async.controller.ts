import { AsyncCall } from '@model/async';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { AsyncSvc } from './async.service';

@Controller('asyncs')
export class AsyncController {
  constructor(private readonly asyncSvc: AsyncSvc) {}

  @Get(':id')
  async getAsyncById(@Param() { id }: { id: string }): Promise<AsyncCall | AsyncCall[]> {
    if (id === 'all') {
      return this.asyncSvc.findAll();
    }
    return this.asyncSvc.findById(id);
  }

  @Post()
  async createAsync(@Body() asyncCall: AsyncCall): Promise<AsyncCall> {
    return this.asyncSvc.create(asyncCall);
  }

  @Post('trigger/:id')
  async triggerAsync(@Param() { id }: { id: string }): Promise<AsyncCall | AsyncCall[]> {
    if (id === 'all') {
      return await this.asyncSvc.triggerAll();
    }
    return await this.asyncSvc.triggerById(id);
  }

  @Post('trigger/url/:partUrl')
  async triggerAsyncByUrl(@Param('partUrl') partUrl: string): Promise<AsyncCall> {
    console.log('triggerAsyncByUrl', partUrl);
    return await this.asyncSvc.triggerByUrl(partUrl);
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
