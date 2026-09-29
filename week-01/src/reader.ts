// ============================================
// READER — Lee el catálogo de beneficios desde data/benefits.json
// ============================================

import { readFile } from 'fs/promises';
import { join } from 'path';
import type { Benefit } from './types.js';

/**
 * Lee y parsea el catálogo de beneficios desde data/benefits.json.
 * Lanza un Error descriptivo si el archivo no existe o no es JSON válido.
 */
export async function readBenefits(): Promise<Benefit[]> {
  const filePath = join(import.meta.dirname, '..', 'data', 'benefits.json');
  try {
    const raw = await readFile(filePath, 'utf-8');
    return JSON.parse(raw) as Benefit[];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `No se pudo leer el catálogo de beneficios en "${filePath}".\n` +
      `Causa: ${message}\n` +
      `Verifica que el archivo data/benefits.json existe y tiene formato JSON válido.`
    );
  }
}
