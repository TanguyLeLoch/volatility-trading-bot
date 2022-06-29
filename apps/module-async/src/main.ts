import { ports } from '@app/core';
import { NestFactory } from '@nestjs/core';
import { AsyncModule } from './async.module';

const moduleName = 'async';

async function bootstrap() {
  const app = await NestFactory.create(AsyncModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
