import { Exchange } from '@model/network';
import { Controller, Delete, Get } from '@nestjs/common';
import { ExchangeSvc } from '../service/exchange.service';

@Controller('exchanges')
export class ExchangeController {
  constructor(private readonly exchangeSvc: ExchangeSvc) {}

  @Get('all')
  async getAllExchange(): Promise<Array<Exchange>> {
    return this.exchangeSvc.findAll();
  }
  @Delete('all')
  async deleteAllExchange(): Promise<void> {
    return this.exchangeSvc.deleteAll();
  }
}
