// ============================================
// LOGGER — Winston + Morgan middleware
// ============================================
import { createLogger, format, transports } from 'winston';
import morgan from 'morgan';
import type { StreamOptions } from 'morgan';

const { combine, timestamp, colorize, printf, json, errors } = format;

const isDev = process.env['NODE_ENV'] !== 'production';

const devFormat = combine(
  colorize({ all: true }),
  timestamp({ format: 'HH:mm:ss' }),
  errors({ stack: true }),
  printf(({ level, message, timestamp: ts, stack }) =>
    stack ? `${ts} [${level}] ${message}\n${stack}` : `${ts} [${level}] ${message}`,
  ),
);

const prodFormat = combine(timestamp(), errors({ stack: true }), json());

export const logger = createLogger({
  level: isDev ? 'http' : 'warn',
  format: isDev ? devFormat : prodFormat,
  transports: [new transports.Console()],
});

const stream: StreamOptions = {
  write: (message: string) => logger.http(message.trim()),
};

export const morganMiddleware = morgan(isDev ? 'dev' : 'combined', { stream });
