import { createLogger, format, transports } from 'winston';
const { combine, timestamp, printf, colorize } = format;

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
    level: 'silly',
    transports: [
      new transports.Console({
        format: format.combine(getFormatFile(moduleName, name), colorize({ all: true })),
        level: 'silly',
      }),
      new transports.File({
        filename: 'global.log',
        level: 'silly',
        format: getFormatFile(moduleName, name),
      }),
    ],
  });

  return logger;
}
