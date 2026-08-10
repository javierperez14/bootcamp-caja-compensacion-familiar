// ============================================
// PROCESSOR — Filtra y calcula estadísticas (funciones puras)
// ============================================

import type { Benefit, BenefitCategory, BenefitSummary } from './types.js';

/** Categorías válidas del dominio */
const VALID_CATEGORIES: BenefitCategory[] = [
  'salud',
  'educacion',
  'recreacion',
  'vivienda',
  'subsidio_monetario',
];

/**
 * Filtra el catálogo por categoría (case-insensitive).
 * Si categoryFilter es null, retorna todos los beneficios.
 * Si la categoría no existe en el catálogo, lanza un Error listando
 * las categorías disponibles.
 */
export function filterByCategory(
  benefits: Benefit[],
  categoryFilter: string | null
): Benefit[] {
  if (categoryFilter === null) {
    return benefits;
  }

  const normalized = categoryFilter.toLowerCase() as BenefitCategory;

  if (!VALID_CATEGORIES.includes(normalized)) {
    throw new Error(
      `La categoría "${categoryFilter}" no es válida.\n` +
      `Categorías disponibles: ${VALID_CATEGORIES.join(', ')}`
    );
  }

  const filtered = benefits.filter(
    (b) => b.category.toLowerCase() === normalized
  );

  if (filtered.length === 0) {
    throw new Error(
      `No se encontraron beneficios en la categoría "${categoryFilter}".\n` +
      `Categorías con beneficios registrados: ${getAvailableCategories(benefits).join(', ')}`
    );
  }

  return filtered;
}

/**
 * Calcula el resumen estadístico del catálogo.
 * Asume que el array tiene al menos un elemento.
 */
export function calculateSummary(benefits: Benefit[]): BenefitSummary {
  const active = benefits.filter((b) => b.active).length;
  const inactive = benefits.length - active;

  const totalValue = benefits.reduce((sum, b) => sum + b.monthlyValue, 0);
  const averageMonthlyValue = Math.round((totalValue / benefits.length) * 100) / 100;

  // Ordenar por monthlyValue para encontrar extremos
  const sorted = [...benefits].sort((a, b) => a.monthlyValue - b.monthlyValue);
  const cheapest = sorted[0];
  const mostExpensive = sorted[sorted.length - 1];

  const categories = Array.from(
    new Set(benefits.map((b) => b.category))
  ) as BenefitCategory[];

  return {
    total: benefits.length,
    active,
    inactive,
    averageMonthlyValue,
    mostExpensive,
    cheapest,
    categories,
  };
}

/** Retorna las categorías presentes en el catálogo (sin duplicados). */
function getAvailableCategories(benefits: Benefit[]): BenefitCategory[] {
  return Array.from(new Set(benefits.map((b) => b.category))) as BenefitCategory[];
}
