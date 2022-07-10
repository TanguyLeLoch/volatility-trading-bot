import { createCustomLogger, Method, ModuleCallerSvc, ports } from '@app/core';
import { Injectable, OnApplicationBootstrap } from '@nestjs/common';
import * as Discord from 'discord.js'; //import discord.js
import { Message } from 'discord.js';
import winston from 'winston';
import { moduleName } from './main';
// const { TextChannel } = Discord;

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
  async manageMessageCreate(message: Discord.Message) {
    // if (message.author.bot) return;
    const isAdmin = message.member.permissions;
    this.logger.info(`${message.author.username} isAdmin: ${isAdmin.has('ADMINISTRATOR')}`);
    this.logger.info(`Message from ${message.author.username}: ${message.content}`);
    if (message.content === '!ping') {
      await this.pingAllModules();
    } else if (message.content === '!delete' && message.member.permissions.has('ADMINISTRATOR')) {
      await this.deletePreviousChannelMessage('grid-trading-bot');
    }
  }
  async deletePreviousChannelMessage(channelName: string) {
    const channel = this.getChannel(channelName);
    const messages = await channel.messages.fetch({ limit: 100 });
    const deletedMessage: Array<Promise<Discord.Message<boolean>>> = messages.map(async (message) => {
      try {
        return await message.delete();
      } catch (error) {
        this.logger.error(error);
      }
      return null;
    });
    await Promise.all(deletedMessage);
  }
  getChannel(channelName: string): Discord.TextChannel {
    return this.client.channels.cache.find(
      (channel: Discord.TextChannel) => channel.name === channelName,
    ) as Discord.TextChannel;
  }

  private async pingAllModules() {
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
    await this.postMessage(message);
  }
}
