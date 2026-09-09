import mongoose from 'mongoose';
import { logger } from '../config/logger';
export async function connectDB(): Promise<void> {
  const uri = process.env['MONGODB_URI'];
  if (!uri) throw new Error('MONGODB_URI no está definida');
  await mongoose.connect(uri);
  logger.info(`[db] Conectado a MongoDB: ${mongoose.connection.name}`);
  mongoose.connection.on('error', (err) => logger.error('[db] Error:', err));
  mongoose.connection.on('disconnected', () => logger.warn('[db] Desconectado'));
}
