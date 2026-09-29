// ============================================
// SCHEMAS ZOD — Validación de entrada
// ============================================
import { z } from 'zod';

export const createBenefitSchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }).min(3).max(100).trim(),
  description: z.string({ required_error: 'La descripción es requerida' }).min(10).trim(),
  maxSubsidy: z.number({ required_error: 'El subsidio máximo es requerido' }).int().positive(),
  available: z.boolean().default(true),
  categoryId: z.number({ required_error: 'La categoría es requerida' }).int().positive(),
});

export const updateBenefitSchema = createBenefitSchema.partial();

export const createCategorySchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }).min(2).max(60).trim(),
  description: z.string({ required_error: 'La descripción es requerida' }).min(5).trim(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const idParamSchema = z.object({
  id: z.coerce.number({ invalid_type_error: 'El id debe ser un número' }).int().positive(),
});

export type CreateBenefitInput = z.infer<typeof createBenefitSchema>;
export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
