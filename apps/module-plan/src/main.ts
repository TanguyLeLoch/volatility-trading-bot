import { NestFactory } from '@nestjs/core';
import { PlanModule } from './plan.module';
import { ports, setModuleName } from '@app/core';

export const moduleName = 'plan';
setModuleName(moduleName);
async function bootstrap() {
  const app = await NestFactory.create(PlanModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
