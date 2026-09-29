// ============================================
// APP — Configuración de Express: middlewares + rutas
// ============================================

import express from 'express';
import type { Application, Request, Response, NextFunction } from 'express';
import { affiliatesRouter } from './routes/affiliates.routes.js';

export function createApp(): Application {
  const app = express();

  // 1. Parseo de body JSON
  app.use(express.json());

  // 2. Logger personalizado: [MÉTODO] /ruta → status (Xms)
  // Usa res.on('finish') para capturar el status y duración reales
  app.use((req: Request, res: Response, next: NextFunction) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
    });
    next();
  });

  // 3. Health check
  app.get('/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok' });
  });

  // 4. Rutas de afiliados
  app.use('/api/v1/affiliates', affiliatesRouter);

  // 5. Handler para rutas no encontradas (404)
  app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
  });

  // 6. Error handler global — SIEMPRE el último, exactamente 4 parámetros
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error('[ERROR]', err.message);

    if (process.env.NODE_ENV !== 'production') {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  return app;
}
