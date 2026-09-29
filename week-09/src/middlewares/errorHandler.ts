import type { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '../errors/AppError';
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof ZodError) { res.status(400).json({ error: 'Validation Error', message: 'Datos inválidos', issues: err.issues.map(i => ({ path: i.path, message: i.message })) }); return; }
  if (err instanceof AppError) { res.status(err.statusCode).json({ error: 'Application Error', message: err.message }); return; }
  if (err instanceof mongoose.Error.CastError) { res.status(400).json({ error: 'Bad Request', message: `Valor '${err.value}' inválido` }); return; }
  if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) { res.status(409).json({ error: 'Conflict', message: 'Ya existe un registro con ese valor' }); return; }
  const e = err instanceof Error ? err : new Error(String(err));
  res.status(500).json({ error: 'Internal Server Error', message: process.env['NODE_ENV'] !== 'production' ? e.message : 'Error inesperado' });
}
