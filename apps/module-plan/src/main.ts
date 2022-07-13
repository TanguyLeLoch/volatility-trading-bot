import { ports, setModuleName } from '@app/core';
import { NestFactory } from '@nestjs/core';
import { moduleName } from './module.info';
import { PlanModule } from './plan.module';

setModuleName(moduleName);
async function bootstrap() {
  const app = await NestFactory.create(PlanModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
