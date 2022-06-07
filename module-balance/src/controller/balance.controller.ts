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
import { BalanceService } from '../service/balance.service';

@Controller('balances')
export class BalanceController {
  constructor(private balanceService: BalanceService) {}

  @Get(':id')
  getBalanceById(@Param() { id }): Promise<Balance> {
    return this.balanceService.findById(id);
  }

  @Get()
  getBalances(): Promise<Array<Balance>> {
    return this.balanceService.findAll();
  }

  @Put()
  putBalance(@Body() balance: Balance): Promise<Balance> {
    return this.balanceService.modify(balance);
  }

  @Post()
  postBalance(@Body() balance: Balance): Promise<Balance> {
    return this.balanceService.create(balance);
  }

  @Delete(':id')
  deleteBalance(@Param() { id }): Promise<Balance> {
    return this.balanceService.delete(id);
  }
}
