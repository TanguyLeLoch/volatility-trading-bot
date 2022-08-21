import { MexcBalance } from '@model/balance';

export interface AccountInformation {
  makerCommission: number;
  takerCommission: number;
  buyerCommission: number;
  sellerCommission: number;
  canTrade: boolean;
  canWithdraw: boolean;
  canDeposit: boolean;
  updateTime?: any;
  accountType: string;
  balances: MexcBalance[];
  permissions: string[];
}
