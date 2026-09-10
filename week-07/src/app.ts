import express from 'express';
import cookieParser from 'cookie-parser';
import { morganMiddleware } from './config/logger';
import { authRouter } from './routes/auth.routes';
import { benefitsRouter } from './routes/benefits.routes';
import { notFound } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(morganMiddleware);

app.get('/health', (_req, res) => {
  res.json({ status: 'ok', week: '07', project: 'autenticacion-jwt' });
});

app.use('/api/v1/auth', authRouter);
app.use('/api/v1/benefits', benefitsRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
