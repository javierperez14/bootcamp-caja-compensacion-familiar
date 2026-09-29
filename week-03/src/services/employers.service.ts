// ============================================
// SERVICE — Lógica de negocio
// ============================================
// Reglas:
// - CERO imports de Express
// - Paginación y validaciones de dominio aquí
// - Retorna undefined cuando no existe; el controller maneja el 404

import type {
  Employer,
  CreateEmployerDto,
  UpdateEmployerDto,
  PaginatedResponse,
  PaginationParams,
} from '../types';
import * as repo from '../repositories/employers.repository';

export async function findAll(params: PaginationParams): Promise<PaginatedResponse<Employer>> {
  const { page, limit } = params;
  const all = await repo.findAll();
  const start = (page - 1) * limit;
  const data = all.slice(start, start + limit);
  return { data, total: all.length, page, limit };
}

export async function findById(id: number): Promise<Employer | undefined> {
  return repo.findById(id);
}

export async function create(dto: CreateEmployerDto): Promise<Employer> {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateEmployerDto): Promise<Employer | undefined> {
  const exists = await repo.findById(id);
  if (!exists) return undefined;
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<boolean> {
  const exists = await repo.findById(id);
  if (!exists) return false;
  return repo.remove(id);
}
