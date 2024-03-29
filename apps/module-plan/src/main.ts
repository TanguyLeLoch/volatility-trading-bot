import { ports, setModuleName } from '@app/core';
import { NestFactory } from '@nestjs/core';
import { moduleName } from './module.info';
import { PlanModule } from './plan.module';

setModuleName(moduleName);

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(PlanModule, { cors: true });
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}

bootstrap().catch((error) => console.error(error));
