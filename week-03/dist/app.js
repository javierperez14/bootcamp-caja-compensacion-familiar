"use strict";
// ============================================
// APP — Configuración Express
// ============================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const employers_routes_1 = require("./routes/employers.routes");
const app = (0, express_1.default)();
// 1. Parseo de body JSON
app.use(express_1.default.json());
// 2. Logger personalizado: [MÉTODO] /ruta → status (Xms)
app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${Date.now() - start}ms)`);
    });
    next();
});
// 3. Health check
app.get('/health', (_req, res) => {
    res.json({ status: 'ok', week: '03', project: 'api-arquitectura-capas' });
});
// 4. Rutas de employers
app.use('/api/v1/employers', employers_routes_1.employersRouter);
// 5. Handler 404 para rutas no encontradas
app.use((_req, res) => {
    const body = { error: 'Not Found', message: 'Ruta no encontrada' };
    res.status(404).json(body);
});
// 6. Error handler global — 4 parámetros, siempre el último
app.use((err, _req, res, _next) => {
    console.error('[ERROR]', err.message);
    const body = {
        error: 'Internal Server Error',
        message: process.env['NODE_ENV'] !== 'production' ? err.message : 'Internal Server Error',
    };
    res.status(500).json(body);
});
exports.default = app;
