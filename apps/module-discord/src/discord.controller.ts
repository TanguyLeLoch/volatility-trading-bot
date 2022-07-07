import { Body, Controller, Post } from '@nestjs/common';
import { Message } from 'discord.js';
import { DiscordService } from './discord.service';

type DiscordPostMessageRequest = {
  content: string;
};

@Controller()
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post()
  postMessage(@Body() { content }: DiscordPostMessageRequest): Promise<Message<boolean>> {
    return this.discordService.postMessage(content);
  }
}
