import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { getModuleName } from '../module.ports';

export const apiKeyMiddlewareHeader = 'api-key-middleware';
const isCheckApiKeyActivated: boolean =
  !process.env.INTERNAL_API_KEY_ACTIVATED || process.env.INTERNAL_API_KEY_ACTIVATED === 'true';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  private logger: winston.Logger = createCustomLogger(getModuleName(), ApiMiddleware.name);

  use(req: Request, res: Response, next: NextFunction): void {
    const headerApiKey = req.headers[apiKeyMiddlewareHeader];
    if (headerApiKey !== process.env.API_KEY_GRID_TRADING && isCheckApiKeyActivated) {
      this.logger.error(`Invalid api key ${headerApiKey}`);
      res.status(401).send('Unauthorized');
    } else {
      next();
    }
  }
}
