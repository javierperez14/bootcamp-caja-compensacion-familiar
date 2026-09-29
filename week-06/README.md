# Semana 06 — MongoDB + Mongoose

**Aprendiz:** Javier Pérez  
**Dominio:** Caja de Compensación Familiar colombiana  
**Recursos:** `Benefit` (principal) y `Category` (secundaria, referencia ObjectId)

## Descripción

API REST con **MongoDB** y **Mongoose ODM**. Incluye relación entre documentos con `populate()`, manejo de errores específicos de MongoDB (11000, CastError) y seed de datos iniciales.

## Colecciones

```
categories                    benefits
──────────────────            ──────────────────────────
_id        ObjectId           _id         ObjectId
name       String (unique)    name        String (unique)
description String            description String
createdAt  Date               maxSubsidy  Number
updatedAt  Date               available   Boolean
                              category    ObjectId → categories
                              createdAt   Date
                              updatedAt   Date
```

## Endpoints

### Benefits `/api/v1/benefits`
| Método | Ruta | Status |
|--------|------|--------|
| GET | `/` | 200 |
| GET | `/:id` | 200 / 404 |
| POST | `/` | 201 / 400 / 409 |
| PUT | `/:id` | 200 / 404 |
| DELETE | `/:id` | 204 / 404 |

### Categories `/api/v1/categories`
| Método | Ruta | Status |
|--------|------|--------|
| GET | `/` | 200 |
| GET | `/:id` | 200 / 404 |
| POST | `/` | 201 / 400 / 409 |
| PUT | `/:id` | 200 / 404 |
| DELETE | `/:id` | 204 / 404 |

## Cómo Ejecutar

```bash
docker compose up -d
cp .env.example .env
npm install
npm run seed
npm run dev
```
