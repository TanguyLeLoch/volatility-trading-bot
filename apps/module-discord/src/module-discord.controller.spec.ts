import { Test, TestingModule } from '@nestjs/testing';
import { ModuleDiscordController } from './module-discord.controller';
import { ModuleDiscordService } from './module-discord.service';

describe('ModuleDiscordController', () => {
  let moduleDiscordController: ModuleDiscordController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [ModuleDiscordController],
      providers: [ModuleDiscordService],
    }).compile();

    moduleDiscordController = app.get<ModuleDiscordController>(ModuleDiscordController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(moduleDiscordController.getHello()).toBe('Hello World!');
    });
  });
});
