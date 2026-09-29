import { z } from 'zod';
export const registerSchema = z.object({
  email: z.string({ required_error: 'El email es requerido' }).email().toLowerCase().trim(),
  password: z.string({ required_error: 'La contraseña es requerida' }).min(6, 'Mínimo 6 caracteres'),
  name: z.string({ required_error: 'El nombre es requerido' }).min(2).trim(),
});
export const loginSchema = z.object({
  email: z.string({ required_error: 'El email es requerido' }).email().toLowerCase().trim(),
  password: z.string({ required_error: 'La contraseña es requerida' }).min(1),
});
export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
