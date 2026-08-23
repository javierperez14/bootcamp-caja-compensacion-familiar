// ============================================
// SERVICE — Lógica de negocio (sin Express)
// ============================================
import type { PaginatedResponse, PaginationParams } from '../types';
import type { CreateBenefitInput, UpdateBenefitInput } from '../schemas/benefit.schema';
import * as repo from '../repositories/benefits.repository';
import { AppError } from '../errors/AppError';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<object>> {
  const { page, limit } = params;
  const { data, total } = await repo.findAll(page, limit);
  return { data, total, page, limit };
}

export async function findById(id: number) {
  const benefit = await repo.findById(id);
  if (!benefit) throw new AppError(404, `Beneficio con id ${id} no encontrado`);
  return benefit;
}

export async function create(dto: CreateBenefitInput) {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateBenefitInput) {
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<void> {
  // findById lanza 404 si no existe antes de intentar borrar
  await findById(id);
  await repo.remove(id);
}
