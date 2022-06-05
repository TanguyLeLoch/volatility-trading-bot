import { Controller, Get } from '@nestjs/common';
import { Balance } from '../model/balance';

@Controller('balances')
export class BalanceController {
  @Get()
  getBalances(): Array<Balance> {
    const balances: Array<Balance> = [];
    for (let i = 0; i < 5; i++) {
      balances.push(new Balance(`token_${i}`, 0, 0, 0));
    }
    return balances;
  }
}
