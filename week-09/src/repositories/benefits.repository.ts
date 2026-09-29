import mongoose from 'mongoose';
import { Benefit } from '../models/benefit.model';
import { AppError } from '../errors/AppError';

export async function findAll() {
  return Benefit.find().populate('createdBy', 'name email').lean();
}
export async function findById(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `Id '${id}' no es válido`);
  return Benefit.findById(id).populate('createdBy', 'name email').lean();
}
export async function create(data: { name: string; description: string; category: string; maxSubsidy: number; available?: boolean; createdBy: string }) {
  const doc = await Benefit.create(data);
  return Benefit.findById(doc._id).populate('createdBy', 'name email').lean();
}
export async function update(id: string, data: Partial<{ name: string; description: string; category: string; maxSubsidy: number; available: boolean }>) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `Id '${id}' no es válido`);
  return Benefit.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('createdBy', 'name email').lean();
}
export async function remove(id: string) {
  if (!mongoose.isValidObjectId(id)) throw new AppError(400, `Id '${id}' no es válido`);
  return Benefit.findByIdAndDelete(id).lean();
}
