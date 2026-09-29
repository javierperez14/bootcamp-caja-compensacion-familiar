import { User } from '../models/user.model';

export async function findByEmail(email: string) {
  return User.findOne({ email }).lean();
}

export async function findById(id: string) {
  return User.findById(id).lean();
}

export async function create(data: { email: string; password: string; name: string }) {
  const user = await User.create(data);
  return user.toObject();
}

export async function updateRefreshTokenHash(id: string, hash: string | null) {
  return User.findByIdAndUpdate(id, { refreshTokenHash: hash }, { new: true }).lean();
}
