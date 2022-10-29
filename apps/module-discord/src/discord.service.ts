import { createCustomLogger, FunctionalException, Method, ModuleCallerSvc, ports } from '@app/core';
import { DiscordMessage, DiscordMessageType } from '@model/discord';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as Discord from 'discord.js'; //import discord.js
import { Message } from 'discord.js';
import winston from 'winston';
import { moduleName } from './module.info';

@Injectable()
export class DiscordService implements OnApplicationBootstrap {
  private readonly logger: winston.Logger = createCustomLogger(moduleName, DiscordService.name);
  private client: Discord.Client;

  constructor(private readonly moduleCallerSvc: ModuleCallerSvc) {}

  onApplicationBootstrap(): void {
    this.client = new Discord.Client({ intents: ['GUILDS', 'GUILD_MESSAGES'] });

    this.client.on('ready', () => {
      this.logger.info(`Logged in as ${this.client.user.tag}!`);
    });

    this.client.on('messageCreate', (message) => this.manageMessageCreate(message));
    this.client.login(process.env.DISCORD_TOKEN);
  }

  async postMessage(content: string): Promise<Message<boolean>> {
    this.logger.info(`Posting message: ${content}`);
    const gridTradingChannel = this.getChannel('grid-trading-bot');
    return await gridTradingChannel.send(content);
  }

  async postMessageWithParams(discordMessage: DiscordMessage): Promise<Message<boolean>> {
    let message = '';
    const gridTradingChannel = this.getChannel('grid-trading-bot');
    switch (discordMessage.type) {
      case DiscordMessageType.SYNC:
        message = this.buildSyncMessage(discordMessage.params);
        // TODO find a better way to delete previous message
        await this.deleteLastMessageContaining(gridTradingChannel, `Pair ${discordMessage.params.pair} is synced at`);
        break;
      case DiscordMessageType.INCREASE_CEILING:
        message = this.buildIncreaseCeilingMessage(discordMessage.params);
        break;
      default:
        throw new FunctionalException(`Unknown message type: ${discordMessage.type}`, 'MESSAGE_TYPE_UNKNOWN');
    }
    return await gridTradingChannel.send(message);
  }

  async deleteLastMessageContaining(gridTradingChannel: Discord.TextChannel, messageSubstring: string): Promise<void> {
    const messages = await gridTradingChannel.messages.fetch({ limit: 100 });

    const messagesToDelete = messages.filter((message) => {
      const content = message.content;
      return content.includes(messageSubstring);
    });
    await this.deleteMessages(messagesToDelete);
  }

  async manageMessageCreate(message: Discord.Message): Promise<void> {
    if (message.author.bot) return;
    this.logger.info(`Message from ${message.author.username}: ${message.content}`);
    if (message.content === '!ping') {
      await this.pingAllModules();
    } else if (message.content === '!delete' && message.member.permissions.has('ADMINISTRATOR')) {
      await this.deletePreviousChannelMessage('grid-trading-bot');
    } else if (message.content === '!triggerAllAsync' && message.member.permissions.has('ADMINISTRATOR')) {
      await this.triggerAllAsync();
    }
  }

  async deletePreviousChannelMessage(channelName: string): Promise<void> {
    const channel = this.getChannel(channelName);
    const messages = await channel.messages.fetch({ limit: 100 });
    await this.deleteMessages(messages);
  }

  private async deleteMessages(messages: Discord.Collection<string, Discord.Message<boolean>>): Promise<void> {
    const deletedMessage: Array<Promise<Discord.Message<boolean>>> = messages.map(async (message) => {
      try {
        return await message.delete();
      } catch (error) {
        this.logger.error(error);
      }
    });
    await Promise.all(deletedMessage);
  }

  getChannel(channelName: string): Discord.TextChannel {
    return this.client.channels.cache.find((channel: Discord.AnyChannel) => {
      if (channel.isText) {
        const textChannel = channel as Discord.TextChannel;
        return textChannel.name === channelName;
      } else {
        return false;
      }
    }) as Discord.TextChannel;
  }

  async pingAllModules(): Promise<Message<boolean>> {
    let message = '';
    for (const moduleNameOfModuleToPing of Object.keys(ports)) {
      try {
        const response = await this.moduleCallerSvc.callModule(moduleNameOfModuleToPing, Method.GET, 'ping', null);
        this.logger.info(`${moduleNameOfModuleToPing}: ${response}`);
        message += `${moduleNameOfModuleToPing}: UP 🫡  ✅\n`;
      } catch (error) {
        this.logger.error(`Error pinging module ${moduleNameOfModuleToPing}: ${error}`);
        message += `${moduleNameOfModuleToPing}: DOWN 🔫  ❌\n`;
      }
    }
    return await this.postMessage(message);
  }

  private async triggerAllAsync(): Promise<void> {
    await this.moduleCallerSvc.callAsyncModule(Method.POST, 'asyncs/trigger/all', null);
  }

  private buildSyncMessage(params: Record<string, string>): string {
    return `Pair ${params.pair} is synced at ${params.time}`;
  }

  private buildIncreaseCeilingMessage(params: Record<string, any>): string {
    return `Ceiling for ${params.pair.token1}/${params.pair.token2} increased by ${
      params.newSteps.length
    }. The new ceiling is ${params.newSteps[params.newSteps.length - 1]}`;
  }
}
