import { Schema, model, Document, Types } from 'mongoose';
export interface IBenefit extends Document {
  name: string; description: string;
  category: 'educacion' | 'salud' | 'recreacion' | 'vivienda' | 'otros';
  maxSubsidy: number; available: boolean; createdBy: Types.ObjectId;
}
const benefitSchema = new Schema<IBenefit>(
  { name: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    description: { type: String, required: true, trim: true, minlength: 10 },
    category: { type: String, required: true, enum: ['educacion', 'salud', 'recreacion', 'vivienda', 'otros'] },
    maxSubsidy: { type: Number, required: true, min: 1 },
    available: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true } },
  { timestamps: true },
);
export const Benefit = model<IBenefit>('Benefit', benefitSchema);
