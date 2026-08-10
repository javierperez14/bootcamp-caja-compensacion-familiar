// ============================================
// SERVER — Entry point con graceful shutdown
// ============================================

import app from './app';

const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';

const server = app.listen(PORT, () => {
  console.log(`[server] Corriendo en http://localhost:${PORT} (${NODE_ENV})`);
  console.log(`[server] Health:      http://localhost:${PORT}/health`);
  console.log(`[server] API v1:      http://localhost:${PORT}/api/v1/employers`);
});

function shutdown(signal: string): void {
  console.log(`\n[server] ${signal} recibido. Cerrando limpiamente...`);
  server.close(() => {
    console.log('[server] Servidor cerrado.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
