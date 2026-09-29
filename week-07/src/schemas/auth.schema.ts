import { z } from 'zod';

export const registerSchema = z.object({
  email: z.string({ required_error: 'El email es requerido' }).email('Email inválido').toLowerCase().trim(),
  password: z.string({ required_error: 'La contraseña es requerida' }).min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string({ required_error: 'El nombre es requerido' }).min(2, 'El nombre debe tener al menos 2 caracteres').trim(),
});

export const loginSchema = z.object({
  email: z.string({ required_error: 'El email es requerido' }).email('Email inválido').toLowerCase().trim(),
  password: z.string({ required_error: 'La contraseña es requerida' }).min(1, 'La contraseña es requerida'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
