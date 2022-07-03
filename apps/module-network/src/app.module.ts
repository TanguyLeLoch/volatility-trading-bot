import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CexModule } from './module/cex.module';

@Module({
  imports: [CexModule],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
