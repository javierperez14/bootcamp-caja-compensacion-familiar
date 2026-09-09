// ============================================
// LOGGER — Winston + Morgan middleware
// ============================================
import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';
import type { StreamOptions } from 'morgan';
import path from 'path';

const { combine, timestamp, colorize, printf, json, errors } = format;

const isDev = process.env['NODE_ENV'] !== 'production';

// Formato legible para desarrollo
const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) => {
    return stack
      ? `${ts} [${level}] ${message}\n${stack}`
      : `${ts} [${level}] ${message}`;
  }),
);

// Formato JSON para producción
const prodFormat = combine(
  timestamp(),
  errors({ stack: true }),
  json(),
);

const loggerTransports: transports.ConsoleTransportInstance[] = [
  new transports.Console(),
];

// En producción, también escribir errores a archivo
const fileTransports: transports.FileTransportInstance[] = isDev
  ? []
  : [new transports.File({ filename: path.join('logs', 'error.log'), level: 'error' })];

export const logger = createLogger({
  level: isDev ? 'http' : 'warn',
  format: isDev ? devFormat : prodFormat,
  transports: [...loggerTransports, ...fileTransports],
});

// Stream para Morgan → redirige logs HTTP a Winston
const stream: StreamOptions = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

// Middleware de Morgan integrado con Winston
export const morganMiddleware = morgan(isDev ? 'dev' : 'combined', { stream });
