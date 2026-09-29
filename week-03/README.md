# Semana 03 — API REST con Arquitectura en Capas

**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso:** `Employer` — empresas afiliantes registradas en la caja

---

## Descripción del dominio

Una empresa afiliante es la organización que paga los aportes parafiscales y registra a sus trabajadores en la Caja de Compensación. Cada empleador tiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador autoincremental |
| `companyName` | `string` | Razón social de la empresa |
| `nit` | `string` | NIT de la empresa |
| `contactEmail` | `string` | Correo del representante |
| `sector` | `'publico' \| 'privado' \| 'mixto'` | Sector económico |
| `employeeCount` | `number` | Número de empleados afiliados |
| `active` | `boolean` | Vigencia del registro |
| `createdAt` | `string` | Fecha de creación (ISO 8601) |

---

## Arquitectura en 4 capas

```
src/
├── types.ts                              → Interfaces: Employer, DTOs, contratos de respuesta
├── repositories/
│   └── employers.repository.ts           → Único acceso a datos (store en memoria)
├── services/
│   └── employers.service.ts              → Lógica de negocio y paginación
├── controllers/
│   └── employers.controller.ts           → Thin controller: extraer → service → responder
├── routes/
│   └── employers.routes.ts               → Solo mapeo URL → controller
├── app.ts                                → Express: middlewares + rutas
└── server.ts                             → Entry point con graceful shutdown
```

**Flujo de una petición:** `Routes → Controller → Service → Repository → Store`

---

## Endpoints

Base URL: `http://localhost:3000/api/v1/employers`

| Método | Ruta | Status | Descripción |
|--------|------|--------|-------------|
| GET | `/health` | 200 | Health check |
| GET | `/api/v1/employers` | 200 | Listar con paginación `?page&limit` |
| GET | `/api/v1/employers/:id` | 200 / 404 | Obtener por ID |
| POST | `/api/v1/employers` | 201 | Crear empresa |
| PUT | `/api/v1/employers/:id` | 200 / 404 | Actualizar empresa |
| DELETE | `/api/v1/employers/:id` | 204 / 404 | Eliminar empresa |

### Contratos de respuesta

```json
// GET /employers?page=1&limit=3 → 200
{ "data": [...], "total": 5, "page": 1, "limit": 3 }

// GET /employers/1 → 200
{ "data": { "id": 1, "companyName": "...", ... } }

// POST /employers → 201
{ "data": { "id": 6, ... } }

// GET /employers/999 → 404
{ "error": "Not Found", "message": "Employer 999 not found" }
```

---

## Cómo ejecutarlo

```bash
pnpm install
pnpm dev        # modo desarrollo con recarga automática
pnpm build      # compilar TypeScript
pnpm start      # ejecutar compilado
```

## Ejemplos curl

```bash
# Listar con paginación
curl "http://localhost:3000/api/v1/employers?page=1&limit=3"

# Obtener por ID
curl http://localhost:3000/api/v1/employers/1

# Crear
curl -X POST http://localhost:3000/api/v1/employers \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Nueva Empresa SAS","nit":"900000001-1","contactEmail":"rrhh@nueva.com","sector":"privado","employeeCount":50,"active":true}'

# Actualizar
curl -X PUT http://localhost:3000/api/v1/employers/1 \
  -H "Content-Type: application/json" \
  -d '{"companyName":"Empresa Actualizada","nit":"900123456-1","contactEmail":"nuevo@empresa.com","sector":"privado","employeeCount":150,"active":true}'

# Eliminar
curl -X DELETE http://localhost:3000/api/v1/employers/1
```
