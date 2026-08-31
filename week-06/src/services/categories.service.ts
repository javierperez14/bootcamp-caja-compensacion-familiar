import * as repo from '../repositories/categories.repository';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';
import { AppError } from '../errors/AppError';
export async function findAll() { return repo.findAll(); }
export async function findById(id: string) {
  const doc = await repo.findById(id);
  if (!doc) throw new AppError(404, `Categoría con id '${id}' no encontrada`);
  return doc;
}
export async function create(dto: CreateCategoryInput) { return repo.create(dto); }
export async function update(id: string, dto: UpdateCategoryInput) {
  const doc = await repo.update(id, dto);
  if (!doc) throw new AppError(404, `Categoría con id '${id}' no encontrada`);
  return doc;
}
export async function remove(id: string): Promise<void> {
  const doc = await repo.remove(id);
  if (!doc) throw new AppError(404, `Categoría con id '${id}' no encontrada`);
}
