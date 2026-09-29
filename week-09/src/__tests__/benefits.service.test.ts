// ============================================
// UNIT TESTS — BenefitsService
// Aislamiento total: repositorio mockeado con jest.mock()
// ============================================
import { AppError } from '../errors/AppError';

// Mock del repositorio ANTES de importar el servicio
jest.mock('../repositories/benefits.repository');

import * as repo from '../repositories/benefits.repository';
import * as service from '../services/benefits.service';

const mockRepo = repo as jest.Mocked<typeof repo>;

const FAKE_USER_ID = '507f1f77bcf86cd799439011';
const FAKE_BENEFIT_ID = '507f191e810c19729de860ea';

const fakeBenefit = {
  _id: FAKE_BENEFIT_ID,
  name: 'Subsidio educativo básico',
  description: 'Apoyo económico para matrícula de educación básica',
  category: 'educacion',
  maxSubsidy: 1200000,
  available: true,
  createdBy: { _id: FAKE_USER_ID, name: 'Javier', email: 'javier@test.com' },
  createdAt: new Date(),
  updatedAt: new Date(),
};

describe('BenefitsService — Unit Tests', () => {

  // ── findAll ──────────────────────────────────────────────────────────────
  describe('findAll()', () => {
    it('debería retornar todos los beneficios', async () => {
      mockRepo.findAll.mockResolvedValue([fakeBenefit] as never);
      const result = await service.findAll();
      expect(result).toHaveLength(1);
      expect(result[0].name).toBe('Subsidio educativo básico');
      expect(mockRepo.findAll).toHaveBeenCalledTimes(1);
    });

    it('debería retornar array vacío si no hay beneficios', async () => {
      mockRepo.findAll.mockResolvedValue([] as never);
      const result = await service.findAll();
      expect(result).toHaveLength(0);
    });
  });

  // ── findById ─────────────────────────────────────────────────────────────
  describe('findById()', () => {
    it('debería retornar el beneficio si existe', async () => {
      mockRepo.findById.mockResolvedValue(fakeBenefit as never);
      const result = await service.findById(FAKE_BENEFIT_ID);
      expect(result.name).toBe('Subsidio educativo básico');
      expect(mockRepo.findById).toHaveBeenCalledWith(FAKE_BENEFIT_ID);
    });

    it('debería lanzar AppError 404 si no existe', async () => {
      mockRepo.findById.mockResolvedValue(null as never);
      await expect(service.findById(FAKE_BENEFIT_ID))
        .rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── create ───────────────────────────────────────────────────────────────
  describe('create()', () => {
    it('debería crear un beneficio con datos válidos', async () => {
      mockRepo.create.mockResolvedValue(fakeBenefit as never);
      const dto = {
        name: 'Subsidio educativo básico',
        description: 'Apoyo económico para matrícula de educación básica',
        category: 'educacion',
        maxSubsidy: 1200000,
      };
      const result = await service.create(dto, FAKE_USER_ID);
      expect(result).toMatchObject({ name: 'Subsidio educativo básico' });
      expect(mockRepo.create).toHaveBeenCalledWith({ ...dto, createdBy: FAKE_USER_ID });
    });
  });

  // ── update ───────────────────────────────────────────────────────────────
  describe('update()', () => {
    it('debería actualizar un beneficio existente', async () => {
      const updated = { ...fakeBenefit, maxSubsidy: 2000000 };
      mockRepo.update.mockResolvedValue(updated as never);
      const result = await service.update(FAKE_BENEFIT_ID, { maxSubsidy: 2000000 });
      expect(result.maxSubsidy).toBe(2000000);
    });

    it('debería lanzar AppError 404 si el beneficio no existe', async () => {
      mockRepo.update.mockResolvedValue(null as never);
      await expect(service.update(FAKE_BENEFIT_ID, { maxSubsidy: 2000000 }))
        .rejects.toMatchObject({ statusCode: 404 });
    });
  });

  // ── remove ───────────────────────────────────────────────────────────────
  describe('remove()', () => {
    it('debería eliminar un beneficio existente', async () => {
      mockRepo.remove.mockResolvedValue(fakeBenefit as never);
      await expect(service.remove(FAKE_BENEFIT_ID)).resolves.toBeUndefined();
      expect(mockRepo.remove).toHaveBeenCalledWith(FAKE_BENEFIT_ID);
    });

    it('debería lanzar AppError 404 si el beneficio no existe', async () => {
      mockRepo.remove.mockResolvedValue(null as never);
      await expect(service.remove(FAKE_BENEFIT_ID))
        .rejects.toMatchObject({ statusCode: 404 });
    });
  });
});
