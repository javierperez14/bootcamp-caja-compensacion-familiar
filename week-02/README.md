# Semana 02 — API CRUD de Afiliados con Express 5

**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso:** `Affiliate` — afiliados registrados en la caja

---

## Descripción del dominio

Un afiliado es un trabajador registrado en la Caja de Compensación Familiar a través de su empleador. Cada afiliado tiene:

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `number` | Identificador autoincremental |
| `fullName` | `string` | Nombre completo del afiliado |
| `documentId` | `string` | Número de cédula |
| `employerName` | `string` | Empresa que realiza la afiliación |
| `affiliationDate` | `string` | Fecha de afiliación (YYYY-MM-DD) |
| `active` | `boolean` | Vigencia de la afiliación |

---

## Endpoints

Base URL: `http://localhost:3000/api/v1/affiliates`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/health` | Health check | 200 |
| GET | `/api/v1/affiliates` | Listar todos los afiliados | 200 |
| GET | `/api/v1/affiliates/:id` | Obtener afiliado por ID | 200 / 404 |
| POST | `/api/v1/affiliates` | Crear afiliado | 201 / 400 |
| PUT | `/api/v1/affiliates/:id` | Actualizar afiliado completo | 200 / 400 / 404 |
| DELETE | `/api/v1/affiliates/:id` | Eliminar afiliado | 204 / 404 |

---

## Cómo ejecutarlo

```bash
# Instalar dependencias
pnpm install

# Modo desarrollo (recarga automática)
pnpm dev

# Compilar TypeScript
pnpm build

# Ejecutar compilado
pnpm start
```

Copia `.env.example` a `.env` para configurar el puerto:
```bash
PORT=3000
NODE_ENV=development
```

---

## Ejemplos curl

```bash
# Health check
curl http://localhost:3000/health

# Listar todos
curl http://localhost:3000/api/v1/affiliates

# Crear afiliado
curl -X POST http://localhost:3000/api/v1/affiliates \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Carlos Perez",
    "documentId": "12345678",
    "employerName": "Empresa ABC SAS",
    "affiliationDate": "2024-01-15"
  }'

# Obtener por ID
curl http://localhost:3000/api/v1/affiliates/1

# ID inexistente → 404
curl http://localhost:3000/api/v1/affiliates/999

# POST sin campos → 400 con lista de campos faltantes
curl -X POST http://localhost:3000/api/v1/affiliates \
  -H "Content-Type: application/json" \
  -d '{}'

# Actualizar
curl -X PUT http://localhost:3000/api/v1/affiliates/1 \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Carlos Perez Actualizado",
    "documentId": "12345678",
    "employerName": "Empresa XYZ SAS",
    "affiliationDate": "2024-01-15",
    "active": true
  }'

# Eliminar → 204 sin body
curl -X DELETE http://localhost:3000/api/v1/affiliates/1

# Eliminar de nuevo → 404
curl -X DELETE http://localhost:3000/api/v1/affiliates/1

# Ruta no encontrada → 404
curl http://localhost:3000/api/v1/no-existe
```

---

## Arquitectura

```
src/
├── types.ts                      → Interfaces TypeScript: Affiliate, CreateAffiliateDto, UpdateAffiliateDto
├── store.ts                      → Store en memoria con getAll, getById, create, update, remove
├── routes/
│   └── affiliates.routes.ts      → 5 endpoints CRUD con validación de campos
├── app.ts                        → Express: middlewares en orden correcto + rutas
└── server.ts                     → Entry point con graceful shutdown (SIGTERM/SIGINT)
```

**Orden de middlewares en `app.ts`:**
1. `express.json()` — parseo de body
2. Logger personalizado — `[MÉTODO] /ruta → status (Xms)` con `res.on('finish')`
3. `GET /health`
4. Rutas `/api/v1/affiliates`
5. Handler 404 para rutas no encontradas
6. Error handler global (4 parámetros, siempre último)
