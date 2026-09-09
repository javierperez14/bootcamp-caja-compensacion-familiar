// ============================================
// ERROR HANDLER — Middleware global de errores
// ============================================
import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { logger } from '../config/logger';
import type { ErrorResponse } from '../types';

export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) {
    res.status(400).json({ error: 'Validation Error', message: 'Los datos enviados no son válidos',
      issues: err.issues.map((i) => ({ path: i.path, message: i.message })) } as ErrorResponse);
    return;
  }

  if (err instanceof AppError) {
    logger.warn(`[AppError] ${err.statusCode} — ${err.message}`);
    res.status(err.statusCode).json({ error: 'Application Error', message: err.message } as ErrorResponse);
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2025') { res.status(404).json({ error: 'Not Found', message: 'Registro no encontrado' }); return; }
    if (err.code === 'P2002') { res.status(409).json({ error: 'Conflict', message: 'Ya existe un registro con ese valor' }); return; }
  }

  const genericError = err instanceof Error ? err : new Error(String(err));
  logger.error(`[UnhandledError] ${genericError.message}`, { stack: genericError.stack });
  res.status(500).json({ error: 'Internal Server Error',
    message: process.env['NODE_ENV'] !== 'production' ? genericError.message : 'Ha ocurrido un error inesperado',
  } as ErrorResponse);
}
