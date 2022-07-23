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
  onApplicationBootstrap() {
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
    switch (discordMessage.type) {
      case DiscordMessageType.SYNC:
        return await this.postSyncMessage(discordMessage.params);
      default:
        throw new FunctionalException(`Unknown message type: ${discordMessage.type}`, 'MESSAGE_TYPE_UNKNOWN');
    }
  }

  async postSyncMessage(params: Record<string, string>): Promise<Message<boolean>> {
    const gridTradingChannel = this.getChannel('grid-trading-bot');
    const message = `Pair ${params.pair} is synced at ${params.time}`;
    await this.deleteLastMessageContaining(gridTradingChannel, `Pair ${params.pair} is synced at`);
    return await gridTradingChannel.send(message);
  }
  async deleteLastMessageContaining(gridTradingChannel: Discord.TextChannel, messageSubstring: string) {
    const messages = await gridTradingChannel.messages.fetch({ limit: 100 });

    const messagesToDelete = messages.filter((message) => {
      const content = message.content;
      return content.includes(messageSubstring);
    });
    await this.deleteMessages(messagesToDelete);
  }

  async manageMessageCreate(message: Discord.Message) {
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

  async deletePreviousChannelMessage(channelName: string) {
    const channel = this.getChannel(channelName);
    const messages = await channel.messages.fetch({ limit: 100 });
    await this.deleteMessages(messages);
  }
  private async deleteMessages(messages: Discord.Collection<string, Discord.Message<boolean>>) {
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
    return this.client.channels.cache.find(
      (channel: Discord.TextChannel) => channel.name === channelName,
    ) as Discord.TextChannel;
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
  private async triggerAllAsync() {
    await this.moduleCallerSvc.callModule('async', Method.POST, 'asyncs/trigger/all', null);
  }
}
