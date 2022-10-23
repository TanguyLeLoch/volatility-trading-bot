import { Balance } from '@model/balance';
import { CexBalance } from '@model/network/cex/balance/cex.balance';

export function cexBalanceToBalance(cexBalance: CexBalance, platform: string): Balance {
  const balance = new Balance();
  balance.token = cexBalance.asset;
  balance.platform = platform;
  balance.inOrder = Number(cexBalance.locked);
  balance.available = Number(cexBalance.free);
  return balance;
}
