import { ModuleCallerModule } from '@app/core/module-caller/module.caller.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BrainSvc } from './service/brain.service';

@Module({
  imports: [ModuleCallerModule],
  controllers: [AppController],
  providers: [BrainSvc],
})
export class AppModule {}
