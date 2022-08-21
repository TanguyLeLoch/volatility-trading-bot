import { Balance, MexcBalance } from '@model/balance';

export function mexcBalanceToBalance(mexcBalance: MexcBalance): Balance {
  const balance = new Balance();
  balance.token = mexcBalance.asset;
  balance.platform = 'MEXC';
  balance.inOrder = Number(mexcBalance.locked);
  balance.available = Number(mexcBalance.free);
  return balance;
}
