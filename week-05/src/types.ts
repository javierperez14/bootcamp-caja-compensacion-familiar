// ============================================
// TYPES — Contratos de respuesta HTTP
// ============================================

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
