import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { BrainSvc } from './service/brain.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [BrainSvc],
})
export class AppModule {}
