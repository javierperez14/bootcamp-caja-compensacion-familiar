// ============================================
// APP — Configuración Express
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import { benefitsRouter } from './routes/benefits.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Parsear JSON
app.use(express.json());

// 2. Logger HTTP (Morgan → Winston)
app.use(morganMiddleware);

// 3. Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '04', project: 'validacion-errores-logging' });
});

// 4. Rutas del dominio
app.use('/api/v1/benefits', benefitsRouter);

// 5. Handler 404 — debe ir ANTES del errorHandler y DESPUÉS de las rutas
app.use(notFound);

// 6. Error handler global — SIEMPRE el último middleware (4 parámetros)
app.use(errorHandler);

export default app;
