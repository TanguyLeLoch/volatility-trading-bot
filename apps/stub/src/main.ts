import { setModuleName } from '@app/core';
import { NestFactory } from '@nestjs/core';
import { moduleName } from './module.info';
import { StubModule } from './stub.module';

setModuleName(moduleName);

async function bootstrap() {
  const app = await NestFactory.create(StubModule, { cors: true });
  await app.listen(43000);
}

bootstrap();
