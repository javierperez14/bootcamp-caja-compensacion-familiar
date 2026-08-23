// ============================================
// SERVER — Entry point
// ============================================
import 'dotenv/config';
import app from './app';
import { logger } from './config/logger';
import { prisma } from './lib/prisma';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

async function bootstrap() {
  // Verificar conexión a la base de datos antes de levantar el servidor
  await prisma.$connect();
  logger.info('[db] Conexión a PostgreSQL establecida');

  app.listen(PORT, () => {
    logger.info(`[server] Corriendo en http://localhost:${PORT} (${NODE_ENV})`);
    logger.info(`[server] Health:      http://localhost:${PORT}/health`);
    logger.info(`[server] Benefits:    http://localhost:${PORT}/api/v1/benefits`);
    logger.info(`[server] Categories:  http://localhost:${PORT}/api/v1/categories`);
  });
}

bootstrap().catch((err) => {
  logger.error('[server] Error al iniciar:', err);
  process.exit(1);
});
