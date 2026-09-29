// ============================================
// MODEL — Benefit (recurso principal con RBAC)
// ============================================
// GET  /api/v1/benefits        → público
// GET  /api/v1/benefits/:id    → público
// POST /api/v1/benefits        → autenticado
// PATCH /api/v1/benefits/:id   → autenticado (dueño) o admin
// DELETE /api/v1/benefits/:id  → solo admin
import { Schema, model, Document, Types } from 'mongoose';
export interface IBenefit extends Document {
  name: string;
  description: string;
  category: 'educacion' | 'salud' | 'recreacion' | 'vivienda' | 'otros';
  maxSubsidy: number;
  available: boolean;
  createdBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}
const benefitSchema = new Schema<IBenefit>(
  {
    name: { type: String, required: [true, 'El nombre es requerido'], unique: true, trim: true, minlength: 3, maxlength: 100 },
    description: { type: String, required: [true, 'La descripción es requerida'], trim: true, minlength: 10 },
    category: { type: String, required: true, enum: ['educacion', 'salud', 'recreacion', 'vivienda', 'otros'] },
    maxSubsidy: { type: Number, required: true, min: 1 },
    available: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true },
);
benefitSchema.index({ category: 1 });
export const Benefit = model<IBenefit>('Benefit', benefitSchema);
