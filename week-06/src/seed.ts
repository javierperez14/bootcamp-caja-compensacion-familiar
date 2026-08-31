import 'dotenv/config';
import { connectDB } from './lib/mongoose';
import { Category } from './models/category.model';
import { Benefit } from './models/benefit.model';
import { logger } from './config/logger';
async function seed() {
  await connectDB();
  logger.info('🌱 Iniciando seed...');
  await Benefit.deleteMany({});
  await Category.deleteMany({});
  const [educacion, salud, recreacion, vivienda, otros] = await Category.insertMany([
    { name: 'Educación', description: 'Beneficios para formación académica y capacitación de afiliados y sus familias' },
    { name: 'Salud', description: 'Programas de atención médica, odontológica y preventiva para afiliados' },
    { name: 'Recreación', description: 'Actividades deportivas, culturales y de esparcimiento familiar' },
    { name: 'Vivienda', description: 'Subsidios y créditos para adquisición o mejora de vivienda' },
    { name: 'Otros', description: 'Beneficios complementarios de libre inversión y servicios adicionales' },
  ]);
  const benefits = await Benefit.insertMany([
    { name: 'Subsidio educativo básico', description: 'Apoyo económico para matrícula de educación básica y media de hijos de afiliados', maxSubsidy: 1200000, available: true, category: educacion._id },
    { name: 'Beca universitaria', description: 'Apoyo parcial para estudios de pregrado en instituciones acreditadas', maxSubsidy: 3500000, available: true, category: educacion._id },
    { name: 'Programa de salud preventiva', description: 'Acceso a chequeos médicos preventivos, odontología y vacunación para afiliados y su familia', maxSubsidy: 800000, available: true, category: salud._id },
    { name: 'Recreación y deporte familiar', description: 'Descuentos en parques recreativos, piscinas y eventos culturales para afiliados', maxSubsidy: 400000, available: true, category: recreacion._id },
    { name: 'Subsidio de vivienda', description: 'Complemento al subsidio familiar de vivienda para adquisición o mejora de inmueble', maxSubsidy: 15000000, available: false, category: vivienda._id },
    { name: 'Crédito de libre inversión', description: 'Préstamos a tasa preferencial para afiliados con más de 6 meses de antigüedad', maxSubsidy: 5000000, available: true, category: otros._id },
  ]);
  logger.info(`✅ ${benefits.length} beneficios insertados`);
  logger.info('🎉 Seed completado');
  process.exit(0);
}
seed().catch((err) => { logger.error('❌ Error:', err); process.exit(1); });
