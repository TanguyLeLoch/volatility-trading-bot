import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { SyncModule } from './module/sync.module';

@Module({
  imports: [SyncModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
