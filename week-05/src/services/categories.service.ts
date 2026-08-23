// ============================================
// SERVICE — Categorías
// ============================================
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/benefit.schema';
import * as repo from '../repositories/categories.repository';
import { AppError } from '../errors/AppError';

export async function findAll() {
  return repo.findAll();
}

export async function findById(id: number) {
  const category = await repo.findById(id);
  if (!category) throw new AppError(404, `Categoría con id ${id} no encontrada`);
  return category;
}

export async function create(dto: CreateCategoryInput) {
  return repo.create(dto);
}

export async function update(id: number, dto: UpdateCategoryInput) {
  return repo.update(id, dto);
}

export async function remove(id: number): Promise<void> {
  await findById(id);
  await repo.remove(id);
}
