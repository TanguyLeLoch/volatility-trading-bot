import { Injectable } from '@nestjs/common';
import { ModuleCallerSvc } from '@app/core';
import { Method } from '@app/core';

@Injectable()
export class BrainSvc {
  constructor(private readonly moduleCallerSvc: ModuleCallerSvc) {}

  async run(): Promise<any> {
    // get the the current order from the DEX
    const orders = await this.moduleCallerSvc.callModule(
      'network',
      Method.GET,
      'update/balances',
      null,
    );
    // get the current balance from the DEX
    const balances = await this.moduleCallerSvc.callModule(
      'network',
      Method.GET,
      'update/orders',
      null,
    );
    console.log(`orders: ${JSON.stringify(orders)}`);
    console.log(`balances: ${JSON.stringify(balances)}`);

    return await this.moduleCallerSvc.callModule(
      'balance',
      Method.GET,
      'balances',
      null,
    );
  }
}
