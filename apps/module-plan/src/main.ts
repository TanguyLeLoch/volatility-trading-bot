import { NestFactory } from '@nestjs/core';
import { PlanModule } from './plan.module';
import { ports } from '@app/core';

const moduleName = 'plan';

async function bootstrap() {
  const app = await NestFactory.create(PlanModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
