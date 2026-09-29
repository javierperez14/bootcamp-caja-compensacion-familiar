"use strict";
// ============================================
// APP — Configuración de Express: middlewares + rutas
// ============================================
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const affiliates_routes_js_1 = require("./routes/affiliates.routes.js");
function createApp() {
    const app = (0, express_1.default)();
    // 1. Parseo de body JSON
    app.use(express_1.default.json());
    // 2. Logger personalizado: [MÉTODO] /ruta → status (Xms)
    // Usa res.on('finish') para capturar el status y duración reales
    app.use((req, res, next) => {
        const start = Date.now();
        res.on('finish', () => {
            const duration = Date.now() - start;
            console.log(`[${req.method}] ${req.originalUrl} → ${res.statusCode} (${duration}ms)`);
        });
        next();
    });
    // 3. Health check
    app.get('/health', (_req, res) => {
        res.json({ status: 'ok' });
    });
    // 4. Rutas de afiliados
    app.use('/api/v1/affiliates', affiliates_routes_js_1.affiliatesRouter);
    // 5. Handler para rutas no encontradas (404)
    app.use((_req, res) => {
        res.status(404).json({ error: 'Ruta no encontrada' });
    });
    // 6. Error handler global — SIEMPRE el último, exactamente 4 parámetros
    app.use((err, _req, res, _next) => {
        console.error('[ERROR]', err.message);
        if (process.env.NODE_ENV !== 'production') {
            res.status(500).json({ error: err.message });
        }
        else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    });
    return app;
}
