import * as winston from 'winston';

import 'winston-daily-rotate-file';

const { combine, timestamp, printf, colorize } = winston.format;
// set silent true in test to avoid log
const _isSilent: boolean = process.env.SILENT_LOG && process.env.SILENT_LOG === 'true';

function getFormatFile(moduleName: string, name: string) {
  return combine(
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    printf(
      (info) => `${info.timestamp} - Module ${moduleName} - ${info.level.toUpperCase()} - [${name}] : ${info.message}`,
    ),
  );
}

export function createCustomLogger(moduleName: string, name: string) {
  const transports = [];
  transports.push(createRollingFileTransport(`log/global-%DATE%.log`, getFormatFile(moduleName, name)));
  if (moduleName) {
    transports.push(createRollingFileTransport(`log/module/${moduleName}-%DATE%.log`, getFormatFile(moduleName, name)));
  }
  if (process.env.ENV != 'prod') {
    transports.push(
      new winston.transports.Console({
        format: winston.format.combine(getFormatFile(moduleName, name), colorize({ all: true })),
        level: 'debug',
      }),
    );
  }
  const logger = winston.createLogger({
    level: 'debug',
    silent: _isSilent,
    transports,
  });

  return logger;
}
function createRollingFileTransport(filePattern: string, format) {
  return new winston.transports.DailyRotateFile({
    filename: filePattern,
    datePattern: 'YYYY-MM-DD',
    zippedArchive: false,
    maxSize: '5m',
    maxFiles: '14d',
    format,
    level: 'debug',
  });
}
