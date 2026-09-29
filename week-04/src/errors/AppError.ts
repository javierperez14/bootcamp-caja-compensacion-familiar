// ============================================
// APP ERROR — Error HTTP del dominio
// ============================================
// isOperational = true  → error esperado (404, 400, etc.)
// isOperational = false → bug del programador (no capturado)

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(statusCode: number, message: string, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Restaurar la cadena de prototipos correcta
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
