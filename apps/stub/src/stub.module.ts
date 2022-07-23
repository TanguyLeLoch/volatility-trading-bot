import { Module } from '@nestjs/common';
import { StubController } from './stub.controller';
import { StubMexcController } from './stub.mexc.controller';
import { StubService } from './stub.service';

@Module({
  imports: [],
  controllers: [StubController, StubMexcController],
  providers: [StubService],
})
export class StubModule {}
