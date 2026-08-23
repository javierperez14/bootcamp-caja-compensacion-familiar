// ============================================
// APP — Configuración Express
// ============================================

import express from 'express';
import type { Request, Response, NextFunction } from 'express';
import { employersRouter } from './routes/employers.routes';
import type { ErrorResponse } from './types';

const app = express();

// 1. Parseo de body JSON
app.use(express.json());

// 2. Logger personalizado: [MÉTODO] /ruta → status (Xms)
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
  });
  next();
});

// 3. Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', week: '03', project: 'api-arquitectura-capas' });
});

// 4. Rutas de employers
app.use('/api/v1/employers', employersRouter);

// 5. Handler 404 para rutas no encontradas
app.use((_req: Request, res: Response) => {
  const body: ErrorResponse = { error: 'Not Found', message: 'Ruta no encontrada' };
  res.status(404).json(body);
});

// 6. Error handler global — 4 parámetros, siempre el último
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[ERROR]', err.message);
  const body: ErrorResponse = {
    error: 'Internal Server Error',
    message: process.env['NODE_ENV'] !== 'production' ? err.message : 'Internal Server Error',
  };
  res.status(500).json(body);
});

export default app;
