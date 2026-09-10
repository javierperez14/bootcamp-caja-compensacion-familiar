// ============================================
// NOT FOUND — 404 handler para rutas inexistentes
// ============================================
import type { Request, Response } from 'express';
import type { ErrorResponse } from '../types';

export function notFound(req: Request, res: Response): void {
  const response: ErrorResponse = {
    error: 'Not Found',
    message: `La ruta ${req.method} ${req.originalUrl} no existe`,
  };
  res.status(404).json(response);
}
