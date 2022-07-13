import { ports, setModuleName } from '@app/core';
import { NestFactory } from '@nestjs/core';
import { DiscordModule } from './discord.module';
import { moduleName } from './module.info';

setModuleName(moduleName);

async function bootstrap() {
  const app = await NestFactory.create(DiscordModule);
  await app.listen(ports[moduleName]);
  console.log(`${moduleName} is running on port: ${ports[moduleName]}`);
}
bootstrap();
