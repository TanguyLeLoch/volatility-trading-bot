import { Balance } from '@model/balance';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { BalanceSvc } from '../service/balance.service';

@Controller('balances')
export class BalanceController {
  constructor(private balanceSvc: BalanceSvc) {}

  @Get(':id')
  getBalanceById(@Param() { id }: { id: string }): Promise<Balance> {
    return this.balanceSvc.findById(id);
  }
  @Get('/token/:token/platform/:platform')
  getBalance(@Param('token') token: string, @Param('platform') platform: string): Promise<Balance> {
    return this.balanceSvc.findByTokenAndPlatform(token, platform);
  }

  @Get()
  getBalances(): Promise<Array<Balance>> {
    return this.balanceSvc.findAll();
  }

  @Put()
  putBalance(@Body() balance: Balance): Promise<Balance> {
    return this.balanceSvc.modify(balance);
  }

  @Post()
  postBalance(@Body() balance: Balance): Promise<Balance> {
    return this.balanceSvc.create(balance);
  }

  @Delete(':id')
  deleteBalance(@Param() { id }: { id: string }): Promise<Balance> {
    return this.balanceSvc.delete(id);
  }
}
