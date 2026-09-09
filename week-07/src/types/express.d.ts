// ============================================
// Extensión de tipos de Express
// Agrega req.user disponible en todas las rutas
// ============================================
import type { JwtPayload } from '../utils/jwt';

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
