import { z } from 'zod';
export const createCategorySchema = z.object({
  name: z.string({ required_error: 'El nombre es requerido' }).min(2).max(60).trim(),
  description: z.string({ required_error: 'La descripción es requerida' }).min(5).trim(),
});
export const updateCategorySchema = createCategorySchema.partial();
export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
