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
export async function create(dto: CreateBenefitInput, userId: string) { return repo.create(dto, userId); }
export async function update(id: string, dto: UpdateBenefitInput, userId: string, userRole: string) {
  const existing = await findById(id);
  // Solo admin o el dueño puede actualizar
  if (userRole !== 'admin' && String((existing.createdBy as { _id: unknown })._id ?? existing.createdBy) !== userId)
    throw new AppError(403, 'No tienes permiso para modificar este beneficio');
  const doc = await repo.update(id, dto);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
  return doc;
}
export async function remove(id: string): Promise<void> {
  const doc = await repo.remove(id);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
}
