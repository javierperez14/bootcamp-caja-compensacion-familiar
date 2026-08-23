// ============================================
// SCHEMAS ZOD — Validación de entrada
// ============================================
import { z } from 'zod';

export const createBenefitSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres')
    .trim(),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .trim(),
  maxSubsidy: z
    .number({ required_error: 'El subsidio máximo es requerido' })
    .int('El subsidio máximo debe ser un entero')
    .positive('El subsidio máximo debe ser mayor a 0'),
  available: z.boolean().default(true),
  categoryId: z
    .number({ required_error: 'La categoría es requerida' })
    .int('El categoryId debe ser un entero')
    .positive('El categoryId debe ser mayor a 0'),
});

export const updateBenefitSchema = createBenefitSchema.partial();

export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El id debe ser un número' })
    .int('El id debe ser un entero')
    .positive('El id debe ser mayor a 0'),
});

export const createCategorySchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(60, 'El nombre no puede superar 60 caracteres')
    .trim(),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(5, 'La descripción debe tener al menos 5 caracteres')
    .trim(),
});

export const updateCategorySchema = createCategorySchema.partial();

export type CreateBenefitInput = z.infer<typeof createBenefitSchema>;
export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
