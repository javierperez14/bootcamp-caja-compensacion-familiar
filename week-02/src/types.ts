// ============================================
// TIPOS — Dominio: Caja de Compensación Familiar
// Recurso: Affiliate (afiliado)
// ============================================

export interface Affiliate {
  id: number;
  fullName: string;        // nombre completo del afiliado
  documentId: string;      // número de cédula
  employerName: string;    // empresa que realiza la afiliación
  affiliationDate: string; // fecha de afiliación (YYYY-MM-DD)
  active: boolean;         // vigencia de la afiliación
}

// DTO para crear un afiliado (sin id ni active — active por defecto true)
export type CreateAffiliateDto = Omit<Affiliate, 'id' | 'active'>;

// DTO para actualizar un afiliado (todos los campos editables)
export type UpdateAffiliateDto = Omit<Affiliate, 'id'>;
