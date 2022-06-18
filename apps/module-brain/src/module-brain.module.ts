import { Module } from '@nestjs/common';
import { ModuleBrainController } from './module-brain.controller';
import { ModuleBrainService } from './module-brain.service';

@Module({
  imports: [],
  controllers: [ModuleBrainController],
  providers: [ModuleBrainService],
})
export class ModuleBrainModule {}
