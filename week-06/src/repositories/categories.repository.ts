import mongoose from 'mongoose';
import { Category } from '../models/category.model';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/category.schema';
import { AppError } from '../errors/AppError';
export async function findAll() { return Category.find().sort({ name: 1 }).lean(); }
export async function findById(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es un ObjectId válido`);
  return Category.findById(id).lean();
}
export async function create(dto: CreateCategoryInput) {
  try { const doc = await Category.create(dto); return doc.toObject(); }
  catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) throw new AppError(409, `Ya existe una categoría con el nombre '${dto.name}'`);
    throw err;
  }
}
export async function update(id: string, dto: UpdateCategoryInput) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es un ObjectId válido`);
  try { return Category.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).lean(); }
  catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) throw new AppError(409, 'Ya existe una categoría con ese nombre');
    throw err;
  }
}
export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es un ObjectId válido`);
  return Category.findByIdAndDelete(id).lean();
}
