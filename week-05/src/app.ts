// ============================================
// APP — Configuración Express
// ============================================
import express from 'express';
import { morganMiddleware } from './config/logger';
import { benefitsRouter } from './routes/benefits.routes';
import { categoriesRouter } from './routes/categories.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Parsear JSON
app.use(express.json());

// 2. Logger HTTP
app.use(morganMiddleware);

// 3. Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '05', project: 'postgresql-prisma' });
});

// 4. Rutas del dominio
app.use('/api/v1/benefits', benefitsRouter);
app.use('/api/v1/categories', categoriesRouter);

// 5. 404
app.use(notFound);

// 6. Error handler global — siempre el último
app.use(errorHandler);

export default app;
