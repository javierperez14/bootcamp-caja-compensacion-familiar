// ============================================
// INTEGRATION TESTS — Benefits Routes
// MongoDB Memory Server — base de datos real en memoria
// ============================================
import 'dotenv/config';
process.env['JWT_ACCESS_SECRET'] = 'test_access_secret_very_long_for_testing';
process.env['JWT_REFRESH_SECRET'] = 'test_refresh_secret_very_long_for_testing';
process.env['JWT_ACCESS_EXPIRES'] = '15m';
process.env['JWT_REFRESH_EXPIRES'] = '7d';

import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import app from '../app';
import { User } from '../models/user.model';
import { Benefit } from '../models/benefit.model';
import bcrypt from 'bcrypt';
import { signAccessToken } from '../utils/jwt';

let mongoServer: MongoMemoryServer;
let userToken: string;
let adminToken: string;
let userId: string;
let adminId: string;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  await mongoose.connect(mongoServer.getUri());

  // Crear usuario normal
  const userPass = await bcrypt.hash('password123', 10);
  const user = await User.create({ email: 'user@test.com', password: userPass, name: 'Usuario', role: 'user' });
  userId = String(user._id);
  userToken = signAccessToken({ sub: userId, email: 'user@test.com', role: 'user' });

  // Crear admin
  const adminPass = await bcrypt.hash('password123', 10);
  const admin = await User.create({ email: 'admin@test.com', password: adminPass, name: 'Admin', role: 'admin' });
  adminId = String(admin._id);
  adminToken = signAccessToken({ sub: adminId, email: 'admin@test.com', role: 'admin' });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

afterEach(async () => {
  await Benefit.deleteMany({});
});

const validBenefit = {
  name: 'Subsidio educativo básico',
  description: 'Apoyo económico para matrícula de educación básica y media',
  category: 'educacion',
  maxSubsidy: 1200000,
  available: true,
};

describe('Benefits Routes — Integration Tests', () => {

  // ── GET /api/v1/benefits ──────────────────────────────────────────────────
  describe('GET /api/v1/benefits', () => {
    it('debería retornar 200 con array vacío', async () => {
      const res = await request(app).get('/api/v1/benefits');
      expect(res.status).toBe(200);
      expect(res.body.data).toEqual([]);
    });

    it('debería retornar los beneficios existentes', async () => {
      await Benefit.create({ ...validBenefit, createdBy: userId });
      const res = await request(app).get('/api/v1/benefits');
      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].name).toBe('Subsidio educativo básico');
    });
  });

  // ── POST /api/v1/benefits ─────────────────────────────────────────────────
  describe('POST /api/v1/benefits', () => {
    it('debería crear un beneficio con token válido → 201', async () => {
      const res = await request(app)
        .post('/api/v1/benefits')
        .set('Cookie', `accessToken=${userToken}`)
        .send(validBenefit);
      expect(res.status).toBe(201);
      expect(res.body.data.name).toBe('Subsidio educativo básico');
    });

    it('debería retornar 401 sin token', async () => {
      const res = await request(app).post('/api/v1/benefits').send(validBenefit);
      expect(res.status).toBe(401);
    });

    it('debería retornar 400 con datos inválidos (nombre muy corto)', async () => {
      const res = await request(app)
        .post('/api/v1/benefits')
        .set('Cookie', `accessToken=${userToken}`)
        .send({ ...validBenefit, name: 'AB' });
      expect(res.status).toBe(400);
      expect(res.body.error).toBe('Validation Error');
    });

    it('debería retornar 400 con categoría inválida', async () => {
      const res = await request(app)
        .post('/api/v1/benefits')
        .set('Cookie', `accessToken=${userToken}`)
        .send({ ...validBenefit, category: 'invalida' });
      expect(res.status).toBe(400);
    });
  });

  // ── GET /api/v1/benefits/:id ──────────────────────────────────────────────
  describe('GET /api/v1/benefits/:id', () => {
    it('debería retornar 200 con un beneficio existente', async () => {
      const benefit = await Benefit.create({ ...validBenefit, createdBy: userId });
      const res = await request(app).get(`/api/v1/benefits/${benefit._id}`);
      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Subsidio educativo básico');
    });

    it('debería retornar 404 con ID inexistente', async () => {
      const res = await request(app).get('/api/v1/benefits/507f1f77bcf86cd799439099');
      expect(res.status).toBe(404);
    });

    it('debería retornar 400 con ID inválido', async () => {
      const res = await request(app).get('/api/v1/benefits/id-invalido');
      expect(res.status).toBe(400);
    });
  });

  // ── PATCH /api/v1/benefits/:id ────────────────────────────────────────────
  describe('PATCH /api/v1/benefits/:id', () => {
    it('debería actualizar un beneficio con token válido → 200', async () => {
      const benefit = await Benefit.create({ ...validBenefit, createdBy: userId });
      const res = await request(app)
        .patch(`/api/v1/benefits/${benefit._id}`)
        .set('Cookie', `accessToken=${userToken}`)
        .send({ maxSubsidy: 2000000 });
      expect(res.status).toBe(200);
      expect(res.body.data.maxSubsidy).toBe(2000000);
    });

    it('debería retornar 401 sin token', async () => {
      const benefit = await Benefit.create({ ...validBenefit, createdBy: userId });
      const res = await request(app).patch(`/api/v1/benefits/${benefit._id}`).send({ maxSubsidy: 2000000 });
      expect(res.status).toBe(401);
    });
  });

  // ── DELETE /api/v1/benefits/:id ───────────────────────────────────────────
  describe('DELETE /api/v1/benefits/:id', () => {
    it('debería eliminar con rol admin → 204', async () => {
      const benefit = await Benefit.create({ ...validBenefit, createdBy: adminId });
      const res = await request(app)
        .delete(`/api/v1/benefits/${benefit._id}`)
        .set('Cookie', `accessToken=${adminToken}`);
      expect(res.status).toBe(204);
    });

    it('debería retornar 403 con rol user', async () => {
      const benefit = await Benefit.create({ ...validBenefit, createdBy: userId });
      const res = await request(app)
        .delete(`/api/v1/benefits/${benefit._id}`)
        .set('Cookie', `accessToken=${userToken}`);
      expect(res.status).toBe(403);
    });

    it('debería retornar 401 sin token', async () => {
      const benefit = await Benefit.create({ ...validBenefit, createdBy: adminId });
      const res = await request(app).delete(`/api/v1/benefits/${benefit._id}`);
      expect(res.status).toBe(401);
    });
  });
});
