import { ports, setModuleName } from '@app/core';
import { NestFactory } from '@nestjs/core';
import { AsyncModule } from './async.module';

export const moduleName = 'async';
setModuleName(moduleName);
async function bootstrap() {
  const app = await NestFactory.create(AsyncModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
