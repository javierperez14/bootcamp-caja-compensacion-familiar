// ============================================
// TIPOS — Dominio: Caja de Compensación Familiar
// Recurso principal: Benefit (beneficio del catálogo)
// ============================================

export interface Benefit {
  id: string;
  name: string;
  category: 'salud' | 'educacion' | 'recreacion' | 'vivienda' | 'subsidio_monetario';
  monthlyValue: number;      // valor mensual del beneficio en COP
  availableQuotas: number;   // cupos disponibles para afiliados
  active: boolean;           // vigencia del beneficio
}

export type BenefitCategory = Benefit['category'];

// Resumen calculado por el procesador
export interface BenefitSummary {
  total: number;
  active: number;
  inactive: number;
  averageMonthlyValue: number;   // redondeado a 2 decimales
  mostExpensive: Benefit;        // beneficio con mayor valor mensual
  cheapest: Benefit;             // beneficio con menor valor mensual
  categories: BenefitCategory[]; // categorías presentes (sin duplicados)
}

// Reporte final que se escribe en output/report.json
export interface Report {
  generatedAt: string;                // ISO 8601
  appliedFilter: BenefitCategory | null;
  summary: BenefitSummary;
  items: Benefit[];
}
