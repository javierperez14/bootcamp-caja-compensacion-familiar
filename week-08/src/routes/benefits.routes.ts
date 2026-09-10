// ============================================
// BENEFITS ROUTES — RBAC aplicado
// ─────────────────────────────────────────
// GET  /           → público (sin auth)
// GET  /:id        → público (sin auth)
// POST /           → autenticado (user o admin)
// PATCH /:id       → autenticado (dueño o admin)
// DELETE /:id      → solo admin
// ============================================
import { Router } from 'express';
import * as controller from '../controllers/benefits.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { requireRole } from '../middlewares/requireRole';

export const benefitsRouter = Router();

// Rutas públicas
benefitsRouter.get('/', controller.getAll);
benefitsRouter.get('/:id', controller.getById);

// Rutas autenticadas
benefitsRouter.post('/', authMiddleware, controller.create);
benefitsRouter.patch('/:id', authMiddleware, controller.update);

// Solo admin
benefitsRouter.delete('/:id', authMiddleware, requireRole('admin'), controller.remove);
