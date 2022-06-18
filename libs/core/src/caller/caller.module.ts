import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ExternalCallerSvc } from './external.caller.service';
import { ModuleCallerSvc } from './module.caller.service';

@Module({
  imports: [HttpModule, ConfigModule.forRoot()],
  providers: [ModuleCallerSvc, ExternalCallerSvc],
  exports: [ModuleCallerSvc, ExternalCallerSvc],
})
export class CallerModule {}
