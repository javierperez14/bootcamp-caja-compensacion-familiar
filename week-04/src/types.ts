// ============================================
// TYPES — Dominio: Caja de Compensación Familiar
// Recurso: Benefit (beneficio ofrecido a afiliados)
// ============================================

export interface Benefit {
  id: number;
  name: string;           // nombre del beneficio (ej: "Subsidio educativo")
  category: 'educacion' | 'salud' | 'recreacion' | 'vivienda' | 'otros';
  description: string;    // descripción detallada del beneficio
  maxSubsidy: number;     // monto máximo de subsidio en pesos colombianos
  available: boolean;     // si está disponible para solicitudes
  createdAt: string;      // ISO 8601
}

// DTO para crear — sin campos auto-generados
export type CreateBenefitDto = Omit<Benefit, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos opcionales
export type UpdateBenefitDto = Partial<CreateBenefitDto>;

// Contratos de respuesta (genéricos, no modificar nombres)
export interface SingleResponse<T> {
  data: T;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface ErrorResponse {
  error: string;
  message: string;
  issues?: { path: (string | number)[]; message: string }[];
}

export interface PaginationParams {
  page: number;
  limit: number;
}
