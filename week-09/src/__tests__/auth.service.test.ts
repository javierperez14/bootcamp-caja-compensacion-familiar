// ============================================
// UNIT TESTS — AuthService
// ============================================
jest.mock('../repositories/users.repository');
jest.mock('bcrypt');
jest.mock('../utils/jwt');

import * as usersRepo from '../repositories/users.repository';
import * as bcrypt from 'bcrypt';
import * as jwtUtils from '../utils/jwt';
import * as authService from '../services/auth.service';

const mockRepo = usersRepo as jest.Mocked<typeof usersRepo>;
const mockBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
const mockJwt = jwtUtils as jest.Mocked<typeof jwtUtils>;

const fakeUser = {
  _id: '507f1f77bcf86cd799439011',
  email: 'javier@test.com',
  password: '$2b$10$hashedpassword',
  name: 'Javier',
  role: 'user' as const,
  refreshTokenHash: null,
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('AuthService — Unit Tests', () => {

  describe('register()', () => {
    it('debería registrar un usuario nuevo', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$hashed');
      mockRepo.create.mockResolvedValue(fakeUser as never);

      const result = await authService.register({
        email: 'javier@test.com', password: '123456', name: 'Javier',
      });

      expect(result.email).toBe('javier@test.com');
      expect(result.role).toBe('user');
    });

    it('debería lanzar AppError 409 si el email ya existe', async () => {
      mockRepo.findByEmail.mockResolvedValue(fakeUser as never);
      await expect(authService.register({ email: 'javier@test.com', password: '123456', name: 'Javier' }))
        .rejects.toMatchObject({ statusCode: 409 });
    });
  });

  describe('login()', () => {
    it('debería retornar tokens con credenciales válidas', async () => {
      mockRepo.findByEmail.mockResolvedValue(fakeUser as never);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(true);
      (mockBcrypt.hash as jest.Mock).mockResolvedValue('$2b$10$refreshhash');
      mockJwt.signAccessToken.mockReturnValue('access-token');
      mockJwt.signRefreshToken.mockReturnValue('refresh-token');
      mockRepo.updateRefreshTokenHash.mockResolvedValue(fakeUser as never);

      const result = await authService.login({ email: 'javier@test.com', password: '123456' });

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user.email).toBe('javier@test.com');
    });

    it('debería lanzar AppError 401 si el email no existe', async () => {
      mockRepo.findByEmail.mockResolvedValue(null);
      await expect(authService.login({ email: 'noexiste@test.com', password: '123456' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });

    it('debería lanzar AppError 401 si la contraseña es incorrecta', async () => {
      mockRepo.findByEmail.mockResolvedValue(fakeUser as never);
      (mockBcrypt.compare as jest.Mock).mockResolvedValue(false);
      await expect(authService.login({ email: 'javier@test.com', password: 'wrongpass' }))
        .rejects.toMatchObject({ statusCode: 401 });
    });
  });

  describe('logout()', () => {
    it('debería invalidar el refresh token', async () => {
      mockRepo.updateRefreshTokenHash.mockResolvedValue(null);
      await expect(authService.logout('507f1f77bcf86cd799439011')).resolves.toBeUndefined();
      expect(mockRepo.updateRefreshTokenHash).toHaveBeenCalledWith('507f1f77bcf86cd799439011', null);
    });
  });
});
