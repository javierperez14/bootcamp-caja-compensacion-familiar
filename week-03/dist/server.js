"use strict";
// ============================================
// SERVER — Entry point con graceful shutdown
// ============================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const PORT = parseInt(process.env['PORT'] ?? '3000', 10);
const NODE_ENV = process.env['NODE_ENV'] ?? 'development';
const server = app_1.default.listen(PORT, () => {
    console.log(`[server] Corriendo en http://localhost:${PORT} (${NODE_ENV})`);
    console.log(`[server] Health:      http://localhost:${PORT}/health`);
    console.log(`[server] API v1:      http://localhost:${PORT}/api/v1/employers`);
});
function shutdown(signal) {
    console.log(`\n[server] ${signal} recibido. Cerrando limpiamente...`);
    server.close(() => {
        console.log('[server] Servidor cerrado.');
        process.exit(0);
    });
}
process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
