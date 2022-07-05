import { createLogger, format, transports } from 'winston';
const { combine, splat, timestamp, printf } = format;

const myFormat = printf(({ level, message, timestamp, ...metadata }) => {
  let msg = `${timestamp} [${level}] : ${message} `;
  if (metadata) {
    msg += JSON.stringify(metadata);
  }
  return msg;
});

export const logger = createLogger({
  level: 'verbose',
  format: combine(format.colorize(), splat(), timestamp(), myFormat),
  transports: [
    new transports.Console({ level: 'verbose' }),
    new transports.File({ filename: 'global.log', level: 'verbose' }),
  ],
});
