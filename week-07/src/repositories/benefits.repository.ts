import mongoose from 'mongoose';
import { Benefit } from '../models/benefit.model';
import type { CreateBenefitInput, UpdateBenefitInput } from '../schemas/benefit.schema';
import { AppError } from '../errors/AppError';

export async function findAll(page: number, limit: number) {
  const [data, total] = await Promise.all([
    Benefit.find().populate('createdBy', 'name email').skip((page - 1) * limit).limit(limit).sort({ createdAt: -1 }).lean(),
    Benefit.countDocuments(),
  ]);
  return { data, total };
}

export async function findById(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es válido`);
  return Benefit.findById(id).populate('createdBy', 'name email').lean();
}

export async function create(dto: CreateBenefitInput, userId: string) {
  try {
    const doc = await Benefit.create({ ...dto, createdBy: userId });
    return Benefit.findById(doc._id).populate('createdBy', 'name email').lean();
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000)
      throw new AppError(409, `Ya existe un beneficio con el nombre '${dto.name}'`);
    throw err;
  }
}

export async function update(id: string, dto: UpdateBenefitInput) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es válido`);
  try {
    return Benefit.findByIdAndUpdate(id, dto, { new: true, runValidators: true }).populate('createdBy', 'name email').lean();
  } catch (err: unknown) {
    if (err instanceof mongoose.mongo.MongoServerError && err.code === 11000)
      throw new AppError(409, 'Ya existe un beneficio con ese nombre');
    throw err;
  }
}

export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `El id '${id}' no es válido`);
  return Benefit.findByIdAndDelete(id).lean();
}
