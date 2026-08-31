import { Schema, model, Document, Types } from 'mongoose';
export interface IBenefit extends Document { name: string; description: string; maxSubsidy: number; available: boolean; category: Types.ObjectId; createdAt: Date; updatedAt: Date; }
const benefitSchema = new Schema<IBenefit>(
  { name: { type: String, required: [true, 'El nombre es requerido'], unique: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: [true, 'La descripción es requerida'], trim: true, minlength: 10 },
    maxSubsidy: { type: Number, required: [true, 'El subsidio máximo es requerido'], min: 1 },
    available: { type: Boolean, default: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: [true, 'La categoría es requerida'] } },
  { timestamps: true });
benefitSchema.index({ name: 1 });
benefitSchema.index({ category: 1 });
export const Benefit = model<IBenefit>('Benefit', benefitSchema);
