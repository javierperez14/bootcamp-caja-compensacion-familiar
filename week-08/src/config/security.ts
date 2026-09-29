// ============================================
// SECURITY CONFIG — Helmet, CORS, Rate Limiters
// ============================================
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

// ── Helmet ───────────────────────────────────────────────────────────────────
export const helmetMiddleware = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'"],
      imgSrc: ["'self'", 'data:'],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: { policy: 'same-origin' },
  crossOriginResourcePolicy: { policy: 'same-origin' },
  dnsPrefetchControl: { allow: false },
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  ieNoOpen: true,
  noSniff: true,
  referrerPolicy: { policy: 'no-referrer' },
  xssFilter: true,
});

// ── CORS ─────────────────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = (process.env['CORS_ORIGINS'] ?? 'http://localhost:3000')
  .split(',')
  .map((o) => o.trim());

export const corsMiddleware = cors({
  origin: (origin, callback) => {
    // Permitir requests sin origin (Postman, curl) solo en desarrollo
    if (!origin && process.env['NODE_ENV'] !== 'production') {
      return callback(null, true);
    }
    if (origin && ALLOWED_ORIGINS.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS: Origin '${origin}' no está en la whitelist`));
  },
  credentials: true,                    // Permite cookies en cross-origin
  methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
});

// ── Rate Limiters ────────────────────────────────────────────────────────────

// General: 100 req / 15 min por IP
export const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too Many Requests', message: 'Demasiadas solicitudes, intenta más tarde' },
});

// Auth: 10 intentos / 15 min (protege contra brute-force)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too Many Requests', message: 'Demasiados intentos de autenticación, intenta más tarde' },
});

// Strict: 30 req / 15 min para endpoints sensibles
export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too Many Requests', message: 'Límite de solicitudes excedido' },
});
