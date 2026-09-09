import { z } from 'zod';

const CATEGORIES = ['educacion', 'salud', 'recreacion', 'vivienda', 'otros'] as const;
const objectIdRegex = /^[0-9a-fA-F]{24}$/;

export const createBenefitSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }).min(3).max(100).trim(),
  description: z.string({ required_error: 'La descripción es requerida' }).min(10).trim(),
  category: z.enum(CATEGORIES, { errorMap: () => ({ message: `La categoría debe ser: ${CATEGORIES.join(', ')}` }) }),
  maxSubsidy: z.number({ required_error: 'El subsidio máximo es requerido' }).int().positive(),
  available: z.boolean().default(true),
});

export const updateBenefitSchema = createBenefitSchema.partial();

export const idParamSchema = z.object({
  id: z.string().regex(objectIdRegex, 'El id debe ser un ObjectId válido'),
});

export type CreateBenefitInput = z.infer<typeof createBenefitSchema>;
export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
