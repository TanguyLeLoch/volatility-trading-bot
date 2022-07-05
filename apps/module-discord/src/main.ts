import { NestFactory } from '@nestjs/core';
import { ModuleDiscordModule } from './module-discord.module';

async function bootstrap() {
  const app = await NestFactory.create(ModuleDiscordModule);
  await app.listen(3000);
}
bootstrap();
