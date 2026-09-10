// ============================================
// AUTH ROUTES — Rate limiting diferenciado
// POST /register → authLimiter (10 req/15min)
// POST /login    → authLimiter
// POST /refresh  → strictLimiter
// POST /logout   → authMiddleware
// GET  /me       → authMiddleware
// ============================================
import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { authLimiter, strictLimiter } from '../config/security';

export const authRouter = Router();

authRouter.post('/register', authLimiter, controller.register);
authRouter.post('/login', authLimiter, controller.login);
authRouter.post('/refresh', strictLimiter, controller.refresh);
authRouter.post('/logout', authMiddleware, controller.logout);
authRouter.get('/me', authMiddleware, controller.me);
