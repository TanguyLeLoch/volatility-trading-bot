import { CallerModule } from '@app/core/caller/caller.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { PingController } from './ping.controller';
import { BrainSvc } from './service/brain.service';

@Module({
  imports: [CallerModule],
  controllers: [AppController, PingController],
  providers: [BrainSvc],
})
export class AppModule {}
