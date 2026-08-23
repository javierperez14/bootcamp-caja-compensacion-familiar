// ============================================
// SEED — Datos demo idempotentes
// Ejecutar: npm run db:seed
// ============================================
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // Upsert de categorías (idempotente por name único)
  const educacion = await prisma.category.upsert({
    where: { name: 'Educación' },
    update: {},
    create: {
      name: 'Educación',
      description: 'Beneficios para formación académica y capacitación de afiliados y sus familias',
    },
  });

  const salud = await prisma.category.upsert({
    where: { name: 'Salud' },
    update: {},
    create: {
      name: 'Salud',
      description: 'Programas de atención médica, odontológica y preventiva para afiliados',
    },
  });

  const recreacion = await prisma.category.upsert({
    where: { name: 'Recreación' },
    update: {},
    create: {
      name: 'Recreación',
      description: 'Actividades deportivas, culturales y de esparcimiento familiar',
    },
  });

  const vivienda = await prisma.category.upsert({
    where: { name: 'Vivienda' },
    update: {},
    create: {
      name: 'Vivienda',
      description: 'Subsidios y créditos para adquisición o mejora de vivienda',
    },
  });

  const otros = await prisma.category.upsert({
    where: { name: 'Otros' },
    update: {},
    create: {
      name: 'Otros',
      description: 'Beneficios complementarios de libre inversión y servicios adicionales',
    },
  });

  console.log('✅ Categorías creadas:', [educacion, salud, recreacion, vivienda, otros].map((c) => c.name));

  // Upsert de beneficios (idempotente por name único)
  const benefits = await Promise.all([
    prisma.benefit.upsert({
      where: { name: 'Subsidio educativo básico' },
      update: {},
      create: {
        name: 'Subsidio educativo básico',
        description: 'Apoyo económico para matrícula de educación básica y media de hijos de afiliados',
        maxSubsidy: 1200000,
        available: true,
        categoryId: educacion.id,
      },
    }),
    prisma.benefit.upsert({
      where: { name: 'Beca universitaria' },
      update: {},
      create: {
        name: 'Beca universitaria',
        description: 'Apoyo parcial para estudios de pregrado en instituciones acreditadas',
        maxSubsidy: 3500000,
        available: true,
        categoryId: educacion.id,
      },
    }),
    prisma.benefit.upsert({
      where: { name: 'Programa de salud preventiva' },
      update: {},
      create: {
        name: 'Programa de salud preventiva',
        description: 'Acceso a chequeos médicos preventivos, odontología y vacunación para afiliados y su familia',
        maxSubsidy: 800000,
        available: true,
        categoryId: salud.id,
      },
    }),
    prisma.benefit.upsert({
      where: { name: 'Recreación y deporte familiar' },
      update: {},
      create: {
        name: 'Recreación y deporte familiar',
        description: 'Descuentos en parques recreativos, piscinas y eventos culturales para afiliados',
        maxSubsidy: 400000,
        available: true,
        categoryId: recreacion.id,
      },
    }),
    prisma.benefit.upsert({
      where: { name: 'Subsidio de vivienda' },
      update: {},
      create: {
        name: 'Subsidio de vivienda',
        description: 'Complemento al subsidio familiar de vivienda para adquisición o mejora de inmueble',
        maxSubsidy: 15000000,
        available: false,
        categoryId: vivienda.id,
      },
    }),
    prisma.benefit.upsert({
      where: { name: 'Crédito de libre inversión' },
      update: {},
      create: {
        name: 'Crédito de libre inversión',
        description: 'Préstamos a tasa preferencial para afiliados con más de 6 meses de antigüedad',
        maxSubsidy: 5000000,
        available: true,
        categoryId: otros.id,
      },
    }),
  ]);

  console.log(`✅ Beneficios creados: ${benefits.length}`);
  console.log('🎉 Seed completado exitosamente');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
