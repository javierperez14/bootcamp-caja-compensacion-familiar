import bcrypt from 'bcrypt';
import * as usersRepo from '../repositories/users.repository';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/jwt';
import { AppError } from '../errors/AppError';
import type { RegisterInput, LoginInput } from '../schemas/auth.schema';
const SALT_ROUNDS = 10;
export async function register(dto: RegisterInput) {
  const existing = await usersRepo.findByEmail(dto.email);
  if (existing) throw new AppError(409, 'El email ya está registrado');
  const passwordHash = await bcrypt.hash(dto.password, SALT_ROUNDS);
  const user = await usersRepo.create({ email: dto.email, password: passwordHash, name: dto.name });
  return { id: user._id, email: user.email, name: user.name, role: user.role };
}
export async function login(dto: LoginInput) {
  const user = await usersRepo.findByEmail(dto.email);
  if (!user) throw new AppError(401, 'Credenciales inválidas');
  const match = await bcrypt.compare(dto.password, user.password);
  if (!match) throw new AppError(401, 'Credenciales inválidas');
  const payload = { sub: String(user._id), email: user.email, role: user.role };
  const accessToken = signAccessToken(payload);
  const refreshToken = signRefreshToken(payload);
  const refreshHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
  await usersRepo.updateRefreshTokenHash(String(user._id), refreshHash);
  return { accessToken, refreshToken, user: { id: user._id, email: user.email, name: user.name, role: user.role } };
}
export async function refresh(refreshToken: string) {
  let payload;
  try { payload = verifyRefreshToken(refreshToken); } catch { throw new AppError(401, 'Refresh token inválido o expirado'); }
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
export async function logout(userId: string) { await usersRepo.updateRefreshTokenHash(userId, null); }
export async function getMe(userId: string) {
  const user = await usersRepo.findById(userId);
  if (!user) throw new AppError(404, 'Usuario no encontrado');
  return { id: user._id, email: user.email, name: user.name, role: user.role };
}
