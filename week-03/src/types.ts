// ============================================
// TYPES — Dominio: Caja de Compensación Familiar
// Recurso: Employer (empresa afiliante)
// ============================================

export interface Employer {
  id: number;
  companyName: string;       // razón social
  nit: string;               // NIT de la empresa
  contactEmail: string;      // correo del representante
  sector: 'publico' | 'privado' | 'mixto';
  employeeCount: number;     // número de empleados afiliados
  active: boolean;
  createdAt: string;         // ISO 8601
}

// DTO para crear — sin campos auto-generados
export type CreateEmployerDto = Omit<Employer, 'id' | 'createdAt'>;

// DTO para actualizar — todos los campos editables opcionales
export type UpdateEmployerDto = Partial<CreateEmployerDto>;

// ─── Contratos de respuesta (genéricos, no modificar nombres) ───────────────

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
}

export interface PaginationParams {
  page: number;
  limit: number;
}
