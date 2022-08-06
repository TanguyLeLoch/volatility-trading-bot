import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;
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
  const logger = createLogger({
    level: 'debug',
    silent: _isSilent,
    transports: [
      new transports.Console({
        format: format.combine(getFormatFile(moduleName, name), colorize({ all: true })),
        level: 'debug',
      }),
      new transports.File({
        filename: 'log/global.log',
        level: 'debug',
        format: getFormatFile(moduleName, name),
        maxsize: 10000000,
      }),
    ],
  });

  return logger;
}
