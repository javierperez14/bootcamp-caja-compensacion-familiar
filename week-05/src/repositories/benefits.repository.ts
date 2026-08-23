// ============================================
// REPOSITORY — Acceso a datos con Prisma
// ============================================
import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { CreateBenefitInput, UpdateBenefitInput } from '../schemas/benefit.schema';
import { AppError } from '../errors/AppError';

export async function findAll(page: number, limit: number) {
  const [data, total] = await prisma.$transaction([
    prisma.benefit.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: { category: true },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.benefit.count(),
  ]);
  return { data, total };
}

export async function findById(id: number) {
  return prisma.benefit.findUnique({
    where: { id },
    include: { category: true },
  });
}

export async function create(dto: CreateBenefitInput) {
  try {
    return await prisma.benefit.create({
      data: dto,
      include: { category: true },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2002') {
        throw new AppError(409, 'Ya existe un beneficio con ese nombre');
      }
      if (e.code === 'P2003') {
        throw new AppError(404, `La categoría con id ${dto.categoryId} no existe`);
      }
    }
    throw e;
  }
}

export async function update(id: number, dto: UpdateBenefitInput) {
  try {
    return await prisma.benefit.update({
      where: { id },
      data: dto,
      include: { category: true },
    });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        throw new AppError(404, `Beneficio con id ${id} no encontrado`);
      }
      if (e.code === 'P2002') {
        throw new AppError(409, 'Ya existe un beneficio con ese nombre');
      }
    }
    throw e;
  }
}

export async function remove(id: number) {
  try {
    await prisma.benefit.delete({ where: { id } });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2025') {
      throw new AppError(404, `Beneficio con id ${id} no encontrado`);
    }
    throw e;
  }
}
