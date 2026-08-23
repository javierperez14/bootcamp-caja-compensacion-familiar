# Semana 04 — Validación y Manejo de Errores

**Aprendiz:** Javier Pérez  
**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso:** `Benefit` (catálogo de beneficios ofrecidos a afiliados)

## Descripción

API REST que extiende la arquitectura en 4 capas de la semana 03 con validación de entrada usando **Zod**, manejo centralizado de errores con `AppError` y un middleware global, y logging con **Winston** integrado con **Morgan**.

## Estructura del Proyecto

```
week-04/
└── src/
    ├── config/logger.ts         # Winston + Morgan middleware
    ├── errors/AppError.ts       # Clase error HTTP del dominio
    ├── schemas/benefit.schema.ts # Validación Zod
    ├── repositories/            # Store en memoria
    ├── services/                # Lógica de negocio
    ├── controllers/             # Capa HTTP
    ├── routes/                  # Definición de rutas
    ├── middlewares/
    │   ├── errorHandler.ts      # Middleware global de errores
    │   └── notFound.ts          # Handler 404
    ├── app.ts
    └── server.ts
```

## Endpoints — `/api/v1/benefits`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/benefits` | Listado paginado (`?page=1&limit=10`) | 200 |
| GET | `/api/v1/benefits/:id` | Obtener por id | 200 / 404 |
| POST | `/api/v1/benefits` | Crear beneficio | 201 / 400 |
| PUT | `/api/v1/benefits/:id` | Actualizar beneficio | 200 / 400 / 404 |
| DELETE | `/api/v1/benefits/:id` | Eliminar beneficio | 204 / 404 |

## Validaciones Zod

| Campo | Regla |
|-------|-------|
| `name` | string, min 3, max 100 |
| `category` | enum: educacion, salud, recreacion, vivienda, otros |
| `description` | string, min 10 |
| `maxSubsidy` | number, entero, positivo |
| `available` | boolean, default true |

## Manejo de Errores

| Tipo | Status |
|------|--------|
| `ZodError` (validación) | 400 con `issues` detallados |
| `AppError` operacional (404, 409...) | status del error |
| Error genérico inesperado | 500 |

## Cómo Ejecutar

```bash
cp .env.example .env
npm install
npm run dev
```
