import 'dotenv/config';
import app from './app';
import { connectDB } from './lib/mongoose';
import { logger } from './config/logger';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

async function bootstrap() {
  await connectDB();
  app.listen(PORT, () => {
    logger.info(`[server] Corriendo en http://localhost:${PORT} (${NODE_ENV})`);
    logger.info(`[server] Health:    http://localhost:${PORT}/health`);
    logger.info(`[server] Auth:      http://localhost:${PORT}/api/v1/auth`);
    logger.info(`[server] Benefits:  http://localhost:${PORT}/api/v1/benefits (protegido)`);
  });
}

bootstrap().catch((err) => {
  logger.error('[server] Error al iniciar:', err);
  process.exit(1);
});
