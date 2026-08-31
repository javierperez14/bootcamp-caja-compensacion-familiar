import mongoose from 'mongoose';
import { Benefit } from '../models/benefit.model';
import type { CreateBenefitInput, UpdateBenefitInput } from '../schemas/benefit.schema';
import { AppError } from '../errors/AppError';
export async function findAll(page: number, limit: number) {
  const [data, total] = await Promise.all([
    Benefit.find().populate('category', 'name description').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).lean(),
    Benefit.countDocuments(),
  ]);
  return { data, total };
}
export async function findById(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es un ObjectId válido`);
  return Benefit.findById(id).populate('category', 'name description').lean();
}
export async function create(dto: CreateBenefitInput) {
  try { const doc = await Benefit.create(dto); return Benefit.findById(doc._id).populate('category', 'name description').lean(); }
  catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) throw new AppError(409, `Ya existe un beneficio con el nombre '${dto.name}'`);
    if (err instanceof mongoose.Error.ValidationError) throw new AppError(400, Object.values(err.errors).map((e) => e.message).join(', '));
    throw err;
  }
}
export async function update(id: string, dto: UpdateBenefitInput) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es un ObjectId válido`);
  try { return Benefit.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).populate('category', 'name description').lean(); }
  catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000) throw new AppError(409, 'Ya existe un beneficio con ese nombre');
    if (err instanceof mongoose.Error.CastError) throw new AppError(400, `Valor '${err.value}' inválido para '${err.path}'`);
    throw err;
  }
}
export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es un ObjectId válido`);
  return Benefit.findByIdAndDelete(id).lean();
}
