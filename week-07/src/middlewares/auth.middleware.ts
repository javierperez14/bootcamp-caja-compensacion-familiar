// ============================================
// AUTH MIDDLEWARE — Verifica access token en cookie
// ============================================
import type { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

export function authMiddleware(req: Request, _res: Response, next: NextFunction): void {
  try {
    const token = req.cookies?.accessToken as string | undefined;
    if (!token) throw new AppError(401, 'No autenticado — token no encontrado');

    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (err) {
    if (err instanceof AppError) { next(err); return; }
    next(new AppError(401, 'Token inválido o expirado'));
  }
}
