import { NestFactory } from '@nestjs/core';
import { StubModule } from './stub.module';

async function bootstrap() {
  const app = await NestFactory.create(StubModule);
  await app.listen(43000);
}
bootstrap();
