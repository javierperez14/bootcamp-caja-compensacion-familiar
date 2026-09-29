# Semana 05 — PostgreSQL + Prisma ORM

**Aprendiz:** Javier Pérez  
**Dominio:** Caja de Compensación Familiar colombiana  
**Recursos:** `Benefit` (principal) y `Category` (secundario, relación 1:N)

## Descripción

API REST que migra el almacenamiento en memoria de la semana 04 a **PostgreSQL** usando **Prisma ORM**. Incluye migraciones versionadas, seed de datos iniciales y manejo correcto de errores de base de datos.

## Diagrama de Entidades

```
Category (1) ──────────── (N) Benefit
─────────────────────────────────────
id          INT  PK       id          INT  PK
name        TEXT UNIQUE   name        TEXT UNIQUE
description TEXT          description TEXT
createdAt   DATETIME      maxSubsidy  INT
updatedAt   DATETIME      available   BOOLEAN
                          categoryId  INT  FK
                          createdAt   DATETIME
                          updatedAt   DATETIME
```

## Estructura del Proyecto

```
week-05/
├── docker-compose.yml       # PostgreSQL 16 en Docker
├── prisma/
│   ├── schema.prisma        # Modelos Category y Benefit
│   └── seed.ts              # 5 categorías y 6 beneficios (idempotente)
└── src/
    ├── lib/prisma.ts        # Singleton PrismaClient
    ├── config/logger.ts     # Winston + Morgan
    ├── errors/AppError.ts   # Error HTTP del dominio
    ├── schemas/             # Validación Zod
    ├── repositories/        # Acceso a datos con Prisma
    ├── services/            # Lógica de negocio
    ├── controllers/         # Capa HTTP
    ├── routes/              # Definición de rutas
    ├── middlewares/         # errorHandler y notFound
    ├── app.ts
    └── server.ts
```

## Endpoints

### Benefits — `/api/v1/benefits`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/benefits` | Listado paginado (`?page=1&limit=10`) | 200 |
| GET | `/api/v1/benefits/:id` | Detalle con categoría incluida | 200 / 404 |
| POST | `/api/v1/benefits` | Crear beneficio | 201 / 400 / 409 |
| PUT | `/api/v1/benefits/:id` | Actualizar beneficio | 200 / 404 |
| DELETE | `/api/v1/benefits/:id` | Eliminar beneficio | 204 / 404 |

### Categories — `/api/v1/categories`

| Método | Ruta | Descripción | Status |
|--------|------|-------------|--------|
| GET | `/api/v1/categories` | Listar con conteo de beneficios | 200 |
| GET | `/api/v1/categories/:id` | Detalle con beneficios incluidos | 200 / 404 |
| POST | `/api/v1/categories` | Crear categoría | 201 / 400 / 409 |
| PUT | `/api/v1/categories/:id` | Actualizar categoría | 200 / 404 |
| DELETE | `/api/v1/categories/:id` | Eliminar categoría | 204 / 404 / 409 |

## Errores Prisma Manejados

| Código | Significado | HTTP |
|--------|-------------|------|
| `P2025` | Registro no encontrado | 404 |
| `P2002` | Unique constraint (nombre duplicado) | 409 |
| `P2003` | Foreign key violation | 404 / 409 |

## Cómo Ejecutar

```bash
# 1. Levantar PostgreSQL
docker compose up -d

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Instalar dependencias
npm install

# 4. Ejecutar migración
npx prisma migrate dev --name init

# 5. Cargar seed
npm run db:seed

# 6. Iniciar servidor
npm run dev
```
