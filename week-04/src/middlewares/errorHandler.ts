// ============================================
// ERROR HANDLER — Middleware global de errores
// ============================================
// DEBE tener exactamente 4 parámetros para que Express lo reconozca
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import type { ErrorResponse } from '../types';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  // 1. ZodError — error de validación de input
  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      error: 'Validation Error',
      message: 'Los datos enviados no son válidos',
      issues: err.issues.map((i) => ({ path: i.path, message: i.message })),
    };
    res.status(400).json(response);
    return;
  }

  // 2. AppError — error operacional del dominio (404, 409, etc.)
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} — ${err.message}`);
    const response: ErrorResponse = {
      error: err.isOperational ? 'Application Error' : 'Internal Server Error',
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // 3. Error genérico — bug inesperado del programador
  const genericError = err instanceof Error ? err : new Error(String(err));
  logger.error(`[UnhandledError] ${genericError.message}`, { stack: genericError.stack });

  const response: ErrorResponse = {
    error: 'Internal Server Error',
    message:
      process.env['NODE_ENV'] !== 'production'
        ? genericError.message
        : 'Ha ocurrido un error inesperado',
  };
  res.status(500).json(response);
}
