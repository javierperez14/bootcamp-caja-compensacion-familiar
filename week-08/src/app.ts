// ============================================
// APP — Configuración Express con capas de seguridad
// ============================================
import express from 'express';
import cookieParser from 'cookie-parser';
import { helmetMiddleware, corsMiddleware, generalLimiter } from './config/security';
import { morganMiddleware } from './config/logger';
import { authRouter } from './routes/auth.routes';
import { benefitsRouter } from './routes/benefits.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

// 1. Seguridad HTTP — headers
app.use(helmetMiddleware);

// 2. CORS con whitelist
app.use(corsMiddleware);

// 3. Rate limiting general
app.use(generalLimiter);

// 4. Parsers
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

// 5. Logging HTTP
app.use(morganMiddleware);

// 6. Sanitización NoSQL injection manual — elimina claves con $ del body
app.use((req, _res, next) => {
  if (req.body && typeof req.body === 'object') {
    const sanitize = (obj: Record<string, unknown>): Record<string, unknown> => {
      const clean: Record<string, unknown> = {};
      for (const key of Object.keys(obj)) {
        if (!key.startsWith('$')) {
          clean[key] = typeof obj[key] === 'object' && obj[key] !== null
            ? sanitize(obj[key] as Record<string, unknown>)
            : obj[key];
        }
      }
      return clean;
    };
    req.body = sanitize(req.body as Record<string, unknown>);
  }
  next();
});

// 7. Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '08', project: 'rbac-security' });
});

// 8. Rutas
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/benefits', benefitsRouter);

// 9. 404
app.use(notFound);

// 10. Error handler global
app.use(errorHandler);

export default app;
