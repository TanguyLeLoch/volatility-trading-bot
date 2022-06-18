import { Module } from '@nestjs/common';
import { SyncController } from '../controller/sync.controller';
import { SyncSvc } from '../service/sync.service';
import { ExternalCallerSvc } from '../service/external.caller.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  controllers: [SyncController],
  providers: [SyncSvc, ExternalCallerSvc],
})
export class SyncModule {}
