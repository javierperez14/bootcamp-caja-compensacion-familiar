import { Schema, model, Document } from 'mongoose';
export interface IUser extends Document {
  email: string; password: string; name: string;
  role: 'user' | 'admin'; refreshTokenHash: string | null;
}
const userSchema = new Schema<IUser>(
  { email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    refreshTokenHash: { type: String, default: null } },
  { timestamps: true },
);
export const User = model<IUser>('User', userSchema);
