import { DiscordMessage } from '@model/discord';
import { Body, Controller, Post } from '@nestjs/common';
import { Message } from 'discord.js';
import { DiscordService } from './discord.service';

type DiscordPostMessageRequest = {
  content: string;
};

@Controller()
export class DiscordController {
  constructor(private readonly discordService: DiscordService) {}

  @Post('ping') // difference is the verb is post, not get as in the other ping controller
  pingDiscord(): Promise<Message<boolean>> {
    return this.discordService.pingAllModules();
  }

  @Post()
  postMessage(@Body() { content }: DiscordPostMessageRequest): Promise<Message<boolean>> {
    return this.discordService.postMessage(content);
  }
  @Post('message')
  postMessageWithParams(@Body() discordMessage: DiscordMessage): Promise<Message<boolean>> {
    return this.discordService.postMessageWithParams(discordMessage);
  }
}
