import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Delete,
} from '@nestjs/common';
import { Balance } from '../model/balance';
import { BalanceSvc } from '../service/balance.service';

@Controller('balances')
export class BalanceController {
  constructor(private balanceSvc: BalanceSvc) {}

  @Get(':id')
  getBalanceById(@Param() { id }): Promise<Balance> {
    return this.balanceSvc.findById(id);
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
  deleteBalance(@Param() { id }): Promise<Balance> {
    return this.balanceSvc.delete(id);
  }
}
