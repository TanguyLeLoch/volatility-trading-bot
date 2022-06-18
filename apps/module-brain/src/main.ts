import { NestFactory } from '@nestjs/core';
import { ModuleBrainModule } from './module-brain.module';

async function bootstrap() {
  const app = await NestFactory.create(ModuleBrainModule);
  await app.listen(3001);
  console.log('Module brain is listening on port 3001');
}
bootstrap();
