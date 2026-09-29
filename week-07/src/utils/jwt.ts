// ============================================
// JWT — sign y verify access + refresh tokens
// ============================================
import jwt from 'jsonwebtoken';

export interface JwtPayload {
  sub: string;   // userId
  email: string;
  role: string;
}

function getSecret(key: string): string {
  const secret = process.env[key];
  if (!secret) throw new Error(`Variable de entorno ${key} no definida`);
  return secret;
}

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret('JWT_ACCESS_SECRET'), {
    expiresIn: (process.env['JWT_ACCESS_EXPIRES'] ?? '15m') as jwt.SignOptions['expiresIn'],
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, getSecret('JWT_REFRESH_SECRET'), {
    expiresIn: (process.env['JWT_REFRESH_EXPIRES'] ?? '7d') as jwt.SignOptions['expiresIn'],
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret('JWT_ACCESS_SECRET')) as JwtPayload;
}

export function verifyRefreshToken(token: string): JwtPayload {
  return jwt.verify(token, getSecret('JWT_REFRESH_SECRET')) as JwtPayload;
}
