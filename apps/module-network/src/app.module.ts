import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { DexModule } from './module/dex.module';

@Module({
  imports: [DexModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
