// ============================================
// REPOSITORY — Categories con Prisma
// ============================================
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { CreateCategoryInput, UpdateCategoryInput } from '../schemas/benefit.schema';
import { AppError } from '../errors/AppError';

export async function findAll() {
  return prisma.category.findMany({
    include: { _count: { select: { benefits: true } } },
    orderBy: { name: 'asc' },
  });
}

export async function findById(id: number) {
  return prisma.category.findUnique({ where: { id }, include: { benefits: true } });
}

export async function create(dto: CreateCategoryInput) {
  try {
    return await prisma.category.create({ data: dto });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002')
      throw new AppError(409, 'Ya existe una categoría con ese nombre');
    throw e;
  }
}

export async function update(id: number, dto: UpdateCategoryInput) {
  try {
    return await prisma.category.update({ where: { id }, data: dto });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') throw new AppError(404, `Categoría con id ${id} no encontrada`);
      if (e.code === 'P2002') throw new AppError(409, 'Ya existe una categoría con ese nombre');
    }
    throw e;
  }
}

export async function remove(id: number) {
  try {
    await prisma.category.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') throw new AppError(404, `Categoría con id ${id} no encontrada`);
      if (e.code === 'P2003') throw new AppError(409, 'No se puede eliminar una categoría con beneficios asociados');
    }
    throw e;
  }
}
