import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// import { ports } from '@app/core';
import { ports, setModuleName } from '@app/core';

const moduleName = 'balance';
setModuleName(moduleName);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
