// ============================================
// SERVER — Entry point
// ============================================
import 'dotenv/config';
import app from './app';
import { logger } from './config/logger';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

app.listen(PORT, () => {
  logger.info(`[server] Corriendo en http://localhost:${PORT} (${NODE_ENV})`);
  logger.info(`[server] Health:      http://localhost:${PORT}/health`);
  logger.info(`[server] API v1:      http://localhost:${PORT}/api/v1/benefits`);
});
