# Semana 07 — Autenticación con JWT

**Aprendiz:** Javier Pérez  
**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso protegido:** `Benefit`

## Descripción

API REST con sistema de autenticación completo usando **bcrypt**, **JWT access/refresh tokens** en **cookies HttpOnly**. Todas las rutas de `Benefit` están protegidas con `authMiddleware`.

## Flujo de Autenticación

```
POST /api/v1/auth/register  → Registro con hash bcrypt
POST /api/v1/auth/login     → Login → cookies HttpOnly (accessToken + refreshToken)
GET  /api/v1/auth/me        → Perfil del usuario autenticado
POST /api/v1/auth/refresh   → Renueva accessToken con rotación de refreshToken
POST /api/v1/auth/logout    → Invalida refreshToken y limpia cookies
```

## Seguridad Implementada

| Criterio | Implementación |
|----------|----------------|
| Contraseñas hasheadas | `bcrypt.hash()` con 10 salt rounds |
| Secrets distintos | `JWT_ACCESS_SECRET` ≠ `JWT_REFRESH_SECRET` |
| Tokens en cookies HttpOnly | Nunca en localStorage ni en body |
| Refresh token hasheado en DB | Solo el hash se almacena |
| Rotación de refresh token | Cada `/refresh` invalida el anterior |
| Rutas protegidas | `authMiddleware` en todas las rutas de benefits |
| User enumeration prevention | Mismo mensaje para email/contraseña incorrectos |

## Endpoints

### Auth `/api/v1/auth`
| Método | Ruta | Auth | Descripción |
|--------|------|------|-------------|
| POST | `/register` | ❌ | Registrar usuario |
| POST | `/login` | ❌ | Login → cookies |
| GET | `/me` | ✅ | Perfil autenticado |
| POST | `/refresh` | ❌ | Renovar access token |
| POST | `/logout` | ✅ | Cerrar sesión |

### Benefits `/api/v1/benefits` (todas protegidas)
| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/` | Listado paginado |
| GET | `/:id` | Obtener por id |
| POST | `/` | Crear beneficio |
| PATCH | `/:id` | Actualizar parcial |
| DELETE | `/:id` | Eliminar |

## Cómo Ejecutar

```bash
docker compose up -d
cp .env.example .env
# Editar .env con secrets reales
npm install
npm run dev
```
