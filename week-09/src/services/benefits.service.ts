import * as repo from '../repositories/benefits.repository';
import { AppError } from '../errors/AppError';

export async function findAll() {
  return repo.findAll();
}

export async function findById(id: string) {
  const doc = await repo.findById(id);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
  return doc;
}

export async function create(data: { name: string; description: string; category: string; maxSubsidy: number; available?: boolean }, userId: string) {
  return repo.create({ ...data, createdBy: userId });
}

export async function update(id: string, data: Partial<{ name: string; description: string; category: string; maxSubsidy: number; available: boolean }>) {
  const doc = await repo.update(id, data);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
  return doc;
}

export async function remove(id: string): Promise<void> {
  const doc = await repo.remove(id);
  if (!doc) throw new AppError(404, `Beneficio con id '${id}' no encontrado`);
}
