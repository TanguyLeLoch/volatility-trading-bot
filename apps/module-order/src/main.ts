import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ports } from '@app/core';

const moduleName = 'order';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
