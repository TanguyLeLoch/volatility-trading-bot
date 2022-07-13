import { CallerModule } from '@app/core';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscordController } from './discord.controller';
import { DiscordService } from './discord.service';

describe('DiscordController', () => {
  let discordController: DiscordController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [CallerModule],
      controllers: [DiscordController],
      providers: [DiscordService],
    }).compile();

    discordController = app.get<DiscordController>(DiscordController);
  });

  describe('root', () => {
    it('should be defined', () => {
      expect(discordController).toBeDefined();
    });
  });
});
