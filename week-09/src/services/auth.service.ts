import bcrypt from 'bcrypt';
import * as usersRepo from '../repositories/users.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';

const SALT_ROUNDS = 10;

export async function register(dto: { email: string; password: string; name: string }) {
  const existing = await usersRepo.findByEmail(dto.email);
  if (existing) throw new AppError(409, 'El email ya está registrado');
  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await usersRepo.create({ ...dto, password: passwordHash });
  return { id: user._id, email: user.email, name: user.name, role: user.role };
}

export async function login(dto: { email: string; password: string }) {
  const user = await usersRepo.findByEmail(dto.email);
  if (!user) throw new AppError(401, 'Credenciales inválidas');
  const match = await bcrypt.compare(dto.password, user.password);
  if (!match) throw new AppError(401, 'Credenciales inválidas');
  const payload = { sub: String(user._id), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  await usersRepo.updateRefreshTokenHash(String(user._id), await bcrypt.hash(refreshToken, SALT_ROUNDS));
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, name: user.name, role: user.role } };
}

export async function refresh(refreshToken: string) {
  let payload;
  try { payload = verifyRefreshToken(refreshToken); } catch { throw new AppError(401, 'Refresh token inválido'); }
  const user = await usersRepo.findById(payload.sub);
  if (!user || !user.refreshTokenHash) throw new AppError(401, 'Sesión no válida');
  const match = await bcrypt.compare(refreshToken, user.refreshTokenHash);
  if (!match) throw new AppError(401, 'Refresh token inválido');
  const newPayload = { sub: String(user._id), email: user.email, role: user.role };
  const newAccess = signAccessToken(newPayload);
  const newRefresh = signRefreshToken(newPayload);
  await usersRepo.updateRefreshTokenHash(String(user._id), await bcrypt.hash(newRefresh, SALT_ROUNDS));
  return { accessToken: newAccess, refreshToken: newRefresh };
}

export async function logout(userId: string) {
  await usersRepo.updateRefreshTokenHash(userId, null);
}
