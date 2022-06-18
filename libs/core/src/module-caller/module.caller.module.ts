import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ModuleCallerSvc } from './module.caller.service';

@Module({
  imports: [HttpModule],
  providers: [ModuleCallerSvc],
  exports: [ModuleCallerSvc],
})
export class ModuleCallerModule {}
