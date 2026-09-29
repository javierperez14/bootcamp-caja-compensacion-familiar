// ============================================
// SERVICE — Lógica de negocio
// ============================================
// CERO imports de Express — solo trabaja con datos y errores de dominio
import type { Benefit, PaginatedResponse, PaginationParams } from '../types';
import type { CreateBenefitInput, UpdateBenefitInput } from '../schemas/benefit.schema';
import * as repo from '../repositories/benefits.repository';
import { AppError } from '../errors/AppError';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Benefit>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Benefit> {
  const benefit = await repo.findById(id);
  if (!benefit) {
    throw new AppError(404, `Beneficio con id ${id} no encontrado`);
  }
  return benefit;
}

export async function create(dto: CreateBenefitInput): Promise<Benefit> {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateBenefitInput): Promise<Benefit> {
  // Verificar existencia antes de actualizar
  await findById(id); // lanza AppError(404) si no existe
  const updated = await repo.update(id, dto);
  if (!updated) {
    throw new AppError(500, 'Error interno al actualizar el beneficio', false);
  }
  return updated;
}

export async function remove(id: number): Promise<void> {
  await findById(id); // lanza AppError(404) si no existe
  await repo.remove(id);
}
