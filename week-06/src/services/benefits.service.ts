import * as repo from '../repositories/benefits.repository';
import type { CreateBenefitInput, UpdateBenefitInput } from '../schemas/benefit.schema';
import { AppError } from '../errors/AppError';
export async function findAll(page: number, limit: number) {
  const { data, total } = await repo.findAll(page, limit);
  return { data, total, page, limit, totalPages: Math.ceil(total / limit) };
}
export async function findById(id: string) {
  const doc = await repo.findById(id);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
  return doc;
}
export async function create(dto: CreateBenefitInput) { return repo.create(dto); }
export async function update(id: string, dto: UpdateBenefitInput) {
  const doc = await repo.update(id, dto);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
  return doc;
}
export async function remove(id: string): Promise<void> {
  const doc = await repo.remove(id);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
}
