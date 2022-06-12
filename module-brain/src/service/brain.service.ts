import { Injectable } from '@nestjs/common';
import { callModule } from 'module-core';
import { Method } from 'module-core';

@Injectable()
export class BrainSvc {
  async run(): Promise<any> {
    // get the the current order from the DEX
    const orders = await callModule(
      'network',
      Method.GET,
      'update/balances',
      null,
    );
    // get the current balance from the DEX
    const balances = await callModule(
      'network',
      Method.GET,
      'update/orders',
      null,
    );
    console.log(`orders: ${JSON.stringify(orders)}`);
    console.log(`balances: ${JSON.stringify(balances)}`);

    return await callModule('balance', Method.GET, 'balances', null);
  }
}
