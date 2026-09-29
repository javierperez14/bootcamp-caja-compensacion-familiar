import express from 'express';
import cookieParser from 'cookie-parser';
import { benefitsRouter } from './routes/benefits.routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.get('/health', (_req, res) => { res.json({ status: 'ok', week: '09', project: 'testing' }); });
app.use('/api/v1/benefits', benefitsRouter);
app.use((_req, res) => { res.status(404).json({ error: 'Not Found' }); });
app.use(errorHandler);

export default app;
