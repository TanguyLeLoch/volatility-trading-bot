import { CallerModule } from '@app/core';
import { Module } from '@nestjs/common';
import { SyncController } from '../controller/sync.controller';
import { SyncSvc } from '../service/sync.service';

@Module({
  imports: [CallerModule],
  controllers: [SyncController],
  providers: [SyncSvc],
})
export class SyncModule {}
