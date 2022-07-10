import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import winston from 'winston';
import { createCustomLogger } from '../logger';
import { getModuleName } from '../module.ports';

export const apiKeyMiddlewareheader = 'api-key-middleware';

@Injectable()
export class ApiMiddleware implements NestMiddleware {
  private logger: winston.Logger = createCustomLogger(getModuleName(), ApiMiddleware.name);
  use(req: Request, res: Response, next: NextFunction) {
    const headerApiKey = req.headers[apiKeyMiddlewareheader];
    if (headerApiKey !== process.env.API_KEY_GRID_TRADING) {
      this.logger.error(`Invalid api key ${headerApiKey}`);
      res.status(401).send('Unauthorized');
    } else {
      next();
    }
  }
}
