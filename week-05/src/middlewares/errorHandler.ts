// ============================================
// ERROR HANDLER — Middleware global de errores
// ============================================
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
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
  // 1. ZodError — validación de input
  if (err instanceof ZodError) {
    const response: ErrorResponse = {
      error: 'Validation Error',
      message: 'Los datos enviados no son válidos',
      issues: err.issues.map((i) => ({ path: i.path, message: i.message })),
    };
    res.status(400).json(response);
    return;
  }

  // 2. AppError — error operacional del dominio
  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} — ${err.message}`);
    const response: ErrorResponse = {
      error: 'Application Error',
      message: err.message,
    };
    res.status(err.statusCode).json(response);
    return;
  }

  // 3. Errores de Prisma no capturados en repository
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') {
      res.status(404).json({ error: 'Not Found', message: 'Registro no encontrado' });
      return;
    }
    if (err.code === 'P2002') {
      res.status(409).json({ error: 'Conflict', message: 'Ya existe un registro con ese valor' });
      return;
    }
  }

  // 4. Error genérico inesperado
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
