import { Body, Controller, Logger, Post } from '@nestjs/common';
import { SyncSvc } from '../service/sync.service';
import { Order } from '@model/order';
import { Pair } from '@model/common';

@Controller('sync')
export class SyncController {
  private readonly logger = new Logger(SyncController.name);
  constructor(private readonly syncSvc: SyncSvc) {}

  @Post('order')
  syncOrder(@Body() syncOrderRequest: SyncOrderRequest): Promise<Order> {
    return this.syncSvc.syncOrder(
      syncOrderRequest.pair,
      syncOrderRequest.platform,
    );
  }
}
type SyncOrderRequest = {
  pair: Pair;
  platform: string;
};
