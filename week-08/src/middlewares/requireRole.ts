// ============================================
// REQUIRE ROLE — Middleware RBAC
// ============================================
// Uso: requireRole('admin') o requireRole('admin', 'moderator')
// SIEMPRE debe ir DESPUÉS de authMiddleware (requiere req.user)
import type { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function requireRole(...roles: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError(401, 'No autenticado — token requerido'));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(new AppError(403, `Acceso denegado — se requiere rol: ${roles.join(' o ')}`));
      return;
    }
    next();
  };
}
