// ============================================
// MODEL — User (autenticación)
// ============================================
import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  email: string;
  password: string;          // hash bcrypt
  name: string;
  role: 'user' | 'admin';
  refreshTokenHash: string | null; // hash del refresh token activo
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    email: { type: String, required: [true, 'El email es requerido'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: [true, 'La contraseña es requerida'], minlength: 6 },
    name: { type: String, required: [true, 'El nombre es requerido'], trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokenHash: { type: String, default: null },
  },
  { timestamps: true },
);

userSchema.index({ email: 1 });
export const User = model<IUser>('User', userSchema);
