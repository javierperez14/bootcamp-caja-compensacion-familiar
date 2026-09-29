# Semana 08 — Autorización RBAC y Seguridad

**Aprendiz:** Javier Pérez  
**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso protegido:** `Benefit`

## Descripción

API REST que extiende la semana 07 con RBAC completo y múltiples capas de seguridad: Helmet, CORS con whitelist, rate limiting diferenciado y sanitización contra NoSQL injection.

## Roles y Permisos

| Rol | Descripción |
|-----|-------------|
| `user` | Usuario autenticado — puede crear y actualizar sus propios beneficios |
| `admin` | Administrador — acceso total incluyendo eliminación |

## Tabla de Endpoints y Acceso

| Método | Ruta | Acceso | Rate Limit |
|--------|------|--------|-----------|
| POST | `/api/v1/auth/register` | Público | 10 req/15min |
| POST | `/api/v1/auth/login` | Público | 10 req/15min |
| GET | `/api/v1/auth/me` | `authMiddleware` | General |
| POST | `/api/v1/auth/refresh` | Público | 30 req/15min |
| POST | `/api/v1/auth/logout` | `authMiddleware` | General |
| GET | `/api/v1/benefits` | Público | General |
| GET | `/api/v1/benefits/:id` | Público | General |
| POST | `/api/v1/benefits` | `authMiddleware` | General |
| PATCH | `/api/v1/benefits/:id` | `authMiddleware` (dueño o admin) | General |
| DELETE | `/api/v1/benefits/:id` | `requireRole('admin')` | General |

## Capas de Seguridad Implementadas

| Capa | Librería | Descripción |
|------|----------|-------------|
| Headers HTTP | `helmet` | CSP, HSTS, X-Frame-Options, noSniff |
| CORS | `cors` | Whitelist de orígenes, no `*` |
| Rate Limiting | `express-rate-limit` | General 100/15min, Auth 10/15min |
| Sanitización NoSQL | `express-mongo-sanitize` | Elimina `$` y `.` de inputs |
| Body limit | Express built-in | Máximo 10kb por request |
| Sin stack trace | `errorHandler` | Solo en producción |

## Cómo Ejecutar

```bash
docker compose up -d
cp .env.example .env
npm install
npm run dev
```

## Probar RBAC

```bash
# 1. Registrar usuario normal
POST /api/v1/auth/register  { "email": "user@test.com", "password": "123456", "name": "Usuario" }

# 2. Login
POST /api/v1/auth/login  { "email": "user@test.com", "password": "123456" }

# 3. Crear beneficio (autenticado) → 201
POST /api/v1/benefits

# 4. Intentar DELETE sin ser admin → 403
DELETE /api/v1/benefits/:id

# 5. Intentar DELETE sin token → 401
DELETE /api/v1/benefits/:id  (sin cookie)

# 6. Superar rate limit en /login → 429
```
