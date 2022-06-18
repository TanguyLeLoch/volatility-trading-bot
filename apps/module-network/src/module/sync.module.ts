import { CallerModule } from '@app/core';
import { Module } from '@nestjs/common';
import { SyncController } from '../controller/sync.controller';
import { MexcSvc } from '../service/mexc.service';
import { SyncSvc } from '../service/sync.service';

@Module({
  imports: [CallerModule],
  controllers: [SyncController],
  providers: [SyncSvc, MexcSvc],
})
export class SyncModule {}
