import { CexBalance } from '@model/network/cex/balance/cex.balance';

export interface CexAccountInformation {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime?: any;
  accountType: string;
  balances: CexBalance[];
  permissions: string[];
}
