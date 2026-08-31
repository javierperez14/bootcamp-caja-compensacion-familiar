import { Schema, model, Document } from 'mongoose';
export interface ICategory extends Document { name: string; description: string; createdAt: Date; updatedAt: Date; }
const categorySchema = new Schema<ICategory>(
  { name: { type: String, required: [true, 'El nombre es requerido'], unique: true, trim: true, minlength: 2, maxlength: 60 },
    description: { type: String, required: [true, 'La descripción es requerida'], trim: true, minlength: 5 } },
  { timestamps: true });
categorySchema.index({ name: 1 });
export const Category = model<ICategory>('Category', categorySchema);
