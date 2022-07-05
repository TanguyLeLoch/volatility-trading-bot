import { Injectable } from '@nestjs/common';

@Injectable()
export class ModuleDiscordService {
  getHello(): string {
    return 'Hello World!';
  }
}
