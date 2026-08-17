// ============================================
// SCHEMAS ZOD — Validación de entrada
// ============================================
import { z } from 'zod';

const CATEGORIES = ['educacion', 'salud', 'recreacion', 'vivienda', 'otros'] as const;

export const createBenefitSchema = z.object({
  name: z
    .string({ required_error: 'El nombre es requerido' })
    .min(3, 'El nombre debe tener al menos 3 caracteres')
    .max(100, 'El nombre no puede superar 100 caracteres')
    .trim(),
  category: z.enum(CATEGORIES, {
    errorMap: () => ({
      message: `La categoría debe ser una de: ${CATEGORIES.join(', ')}`,
    }),
  }),
  description: z
    .string({ required_error: 'La descripción es requerida' })
    .min(10, 'La descripción debe tener al menos 10 caracteres')
    .trim(),
  maxSubsidy: z
    .number({ required_error: 'El subsidio máximo es requerido' })
    .positive('El subsidio máximo debe ser mayor a 0')
    .int('El subsidio máximo debe ser un número entero'),
  available: z.boolean().default(true),
});

// Reutiliza el schema de creación con todos los campos opcionales
export const updateBenefitSchema = createBenefitSchema.partial();

// Schema para validar el parámetro :id
export const idParamSchema = z.object({
  id: z.coerce
    .number({ invalid_type_error: 'El id debe ser un número' })
    .int('El id debe ser un entero')
    .positive('El id debe ser mayor a 0'),
});

// Tipos inferidos desde los schemas
export type CreateBenefitInput = z.infer<typeof createBenefitSchema>;
export type UpdateBenefitInput = z.infer<typeof updateBenefitSchema>;
