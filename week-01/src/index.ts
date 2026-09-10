// ============================================
// ENTRY POINT — Orquesta el flujo completo
// ============================================

import { readBenefits } from './reader.js';
import { filterByCategory, calculateSummary } from './processor.js';
import { writeReport } from './writer.js';
import type { BenefitCategory, Report } from './types.js';

/** Parsea el argumento --category desde process.argv */
function parseCategoryFilter(): string | null {
  const args = process.argv.slice(2);
  const idx = args.indexOf('--category');
  if (idx !== -1 && args[idx + 1] !== undefined) {
    return args[idx + 1];
  }
  return null;
}

async function main(): Promise<void> {
  const categoryFilter = parseCategoryFilter();

  try {
    // 1. Leer catálogo de beneficios
    const allBenefits = await readBenefits();

    // 2. Filtrar por categoría (o devolver todos si no hay filtro)
    const filteredBenefits = filterByCategory(allBenefits, categoryFilter);

    // 3. Calcular resumen estadístico
    const summary = calculateSummary(filteredBenefits);

    // 4. Construir reporte
    const report: Report = {
      generatedAt: new Date().toISOString(),
      appliedFilter: categoryFilter as BenefitCategory | null,
      summary,
      items: filteredBenefits,
    };

    // 5. Imprimir resumen en consola
    console.log('\n📋 CATÁLOGO DE BENEFICIOS — CAJA DE COMPENSACIÓN FAMILIAR');
    console.log('═'.repeat(55));
    if (categoryFilter !== null) {
      console.log(`🔍 Filtro aplicado: ${categoryFilter}`);
    }
    console.log(`📦 Total de beneficios:    ${summary.total}`);
    console.log(`✅ Activos:                ${summary.active}`);
    console.log(`❌ Inactivos:              ${summary.inactive}`);
    console.log(
      `💰 Valor mensual promedio: $${summary.averageMonthlyValue.toLocaleString('es-CO')} COP`
    );
    console.log(
      `📈 Más costoso:            ${summary.mostExpensive.name} ` +
      `($${summary.mostExpensive.monthlyValue.toLocaleString('es-CO')} COP)`
    );
    console.log(
      `📉 Más económico:          ${summary.cheapest.name} ` +
      `($${summary.cheapest.monthlyValue.toLocaleString('es-CO')} COP)`
    );
    console.log(`🏷️  Categorías presentes:   ${summary.categories.join(', ')}`);

    // 6. Escribir reporte en disco
    await writeReport(report);

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\n❌ Error: ${message}`);
    process.exit(1);
  }
}

main();
