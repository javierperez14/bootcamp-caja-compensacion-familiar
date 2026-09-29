# Semana 09 — Testing con Jest + Supertest

**Aprendiz:** Javier Pérez  
**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso testeado:** `Benefit`

## Descripción

Suite completa de tests para la API de Beneficios. Incluye unit tests con mocks para los servicios e integration tests con MongoDB Memory Server para las rutas HTTP.

## Estructura de Tests

```
src/__tests__/
├── auth.service.test.ts      # Unit tests — AuthService con mocks
├── benefits.service.test.ts  # Unit tests — BenefitsService con mocks
└── benefits.routes.test.ts   # Integration tests — Rutas HTTP + MongoDB Memory Server
```

## Cobertura Objetivo

| Métrica | Umbral |
|---------|--------|
| Statements | ≥ 80% |
| Branches | ≥ 70% |
| Functions | ≥ 80% |
| Lines | ≥ 80% |

## Tests Implementados

### Unit Tests — BenefitsService (10 tests)
- `findAll()` → happy path y array vacío
- `findById()` → happy path y AppError 404
- `create()` → happy path con datos válidos
- `update()` → happy path y AppError 404
- `remove()` → happy path y AppError 404

### Unit Tests — AuthService (5 tests)
- `register()` → happy path y 409 duplicado
- `login()` → happy path, 401 email no existe, 401 contraseña incorrecta
- `logout()` → invalida refresh token

### Integration Tests — Benefits Routes (12 tests)
- `GET /` → 200 vacío y con datos
- `POST /` → 201 con auth, 401 sin token, 400 datos inválidos
- `GET /:id` → 200 existente, 404 inexistente, 400 id inválido
- `PATCH /:id` → 200 con auth, 401 sin token
- `DELETE /:id` → 204 admin, 403 user, 401 sin token

## Comandos

```bash
npm install
npm test              # correr todos los tests
npm run test:coverage # cobertura de código
```
