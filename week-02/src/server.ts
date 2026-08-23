// ============================================
// SERVER — Entry point: arranca el servidor con graceful shutdown
// ============================================

import { createApp } from './app.js';

const PORT = process.env.PORT ?? '3000';
const NODE_ENV = process.env.NODE_ENV ?? 'development';

const app = createApp();

const server = app.listen(Number(PORT), () => {
  console.log(`[SERVER] Servidor corriendo en http://localhost:${PORT} (${NODE_ENV})`);
});

// Graceful shutdown — cierra conexiones activas antes de terminar
function shutdown(signal: string): void {
  console.log(`\n[SERVER] ${signal} recibido. Cerrando servidor limpiamente...`);
  server.close(() => {
    console.log('[SERVER] Servidor cerrado. Proceso terminado.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
