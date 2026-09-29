// ============================================
// WRITER — Escribe el reporte en output/report.json
// ============================================

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import type { Report } from './types.js';

/**
 * Serializa y escribe el reporte en output/report.json.
 * Crea el directorio output/ si no existe.
 */
export async function writeReport(report: Report): Promise<void> {
  const outputDir = join(import.meta.dirname, '..', 'output');
  const outputPath = join(outputDir, 'report.json');

  // { recursive: true } no lanza error si el directorio ya existe
  await mkdir(outputDir, { recursive: true });

  const content = JSON.stringify(report, null, 2);
  await writeFile(outputPath, content, 'utf-8');

  console.log(`\n✅ Reporte guardado en: ${outputPath}`);
}
