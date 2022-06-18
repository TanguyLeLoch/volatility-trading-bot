import { Controller } from '@nestjs/common';
import { ExchangeSvc } from '../service/exchange.service';

@Controller('exchange')
export class ExchangeController {
  constructor(private readonly exchangeSvc: ExchangeSvc) {}
}
