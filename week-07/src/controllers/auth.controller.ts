// ============================================
// CONTROLLER — Auth
// ============================================
import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/auth.service';
import { registerSchema, loginSchema } from '../schemas/auth.schema';

const COOKIE_OPTS_ACCESS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax' as const,
  maxAge: 15 * 60 * 1000, // 15 min
};

const COOKIE_OPTS_REFRESH = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
  path: '/api/v1/auth/refresh',
};

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation Error', message: 'Datos inválidos', issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) }); return; }
    const user = await service.register(parsed.data);
    res.status(201).json({ message: 'Usuario registrado exitosamente', data: user });
  } catch (err) { next(err); }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) { res.status(400).json({ error: 'Validation Error', message: 'Datos inválidos', issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) }); return; }
    const { accessToken, refreshToken, user } = await service.login(parsed.data);
    res.cookie('accessToken', accessToken, COOKIE_OPTS_ACCESS);
    res.cookie('refreshToken', refreshToken, COOKIE_OPTS_REFRESH);
    res.json({ message: 'Login exitoso', data: user });
  } catch (err) { next(err); }
}

export async function refresh(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const refreshToken = req.cookies?.refreshToken as string | undefined;
    if (!refreshToken) { res.status(401).json({ error: 'Application Error', message: 'Refresh token no encontrado' }); return; }
    const { accessToken, refreshToken: newRefreshToken } = await service.refresh(refreshToken);
    res.cookie('accessToken', accessToken, COOKIE_OPTS_ACCESS);
    res.cookie('refreshToken', newRefreshToken, COOKIE_OPTS_REFRESH);
    res.json({ message: 'Token renovado exitosamente' });
  } catch (err) { next(err); }
}

export async function logout(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (req.user?.sub) await service.logout(req.user.sub);
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken', { path: '/api/v1/auth/refresh' });
    res.json({ message: 'Sesión cerrada exitosamente' });
  } catch (err) { next(err); }
}

export async function me(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const user = await service.getMe(req.user!.sub);
    res.json({ data: user });
  } catch (err) { next(err); }
}
