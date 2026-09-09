# Semana 01 — Procesador de Catálogo de Beneficios

**Dominio:** Caja de Compensación Familiar colombiana  
**Recurso principal:** `Benefit` — beneficios del catálogo (salud, educación, recreación, vivienda, subsidios monetarios)

---

## Descripción del dominio

Una Caja de Compensación Familiar ofrece a sus afiliados un catálogo de beneficios agrupados en cinco categorías:

| Categoría | Ejemplos |
|-----------|---------|
| `salud` | Consultas médicas, odontología, psicología |
| `educacion` | Becas universitarias, subsidio de útiles, cursos |
| `recreacion` | Parques, paquetes vacacionales, clases de natación |
| `vivienda` | Subsidio VIS, mejoramiento de vivienda, arrendamiento |
| `subsidio_monetario` | Subsidio familiar, auxilio desempleo, subsidio adulto mayor |

Cada beneficio tiene:
- `id` — identificador único
- `name` — nombre del beneficio
- `category` — una de las cinco categorías válidas
- `monthlyValue` — valor mensual en COP
- `availableQuotas` — cupos disponibles para afiliados
- `active` — indica si el beneficio está vigente

---

## Implementación

El proyecto sigue una arquitectura de módulos con separación de responsabilidades:

```
src/
├── types.ts      → Interfaces TypeScript del dominio (Benefit, BenefitSummary, Report)
├── reader.ts     → Lee data/benefits.json con fs/promises
├── processor.ts  → Funciones puras: filterByCategory, calculateSummary
├── writer.ts     → Escribe output/report.json con fs/promises
└── index.ts      → Orquesta el flujo, parsea args, maneja errores
```

**Decisiones técnicas:**
- 100% ESM (`"type": "module"`) — ningún `require()`
- TypeScript `strict: true` — sin `any`
- Toda I/O con `async/await` sobre `fs/promises`
- `import.meta.dirname` para rutas independientes del CWD
- `mkdir({ recursive: true })` para crear `output/` si no existe

---

## Cómo ejecutarlo

```bash
# Instalar dependencias
pnpm install

# Ejecutar sin filtro — procesa todos los beneficios
pnpm dev

# Filtrar por categoría (case-insensitive)
pnpm dev -- --category salud
pnpm dev -- --category educacion
pnpm dev -- --category recreacion
pnpm dev -- --category vivienda
pnpm dev -- --category subsidio_monetario

# Verificar compilación TypeScript
pnpm build
```

### Categoría inexistente

```bash
pnpm dev -- --category deporte
# ❌ Error: La categoría "deporte" no es válida.
# Categorías disponibles: salud, educacion, recreacion, vivienda, subsidio_monetario
```

### Archivo de datos ausente

Si `data/benefits.json` no existe, el programa muestra un error descriptivo con la ruta exacta y termina con `process.exit(1)`.

---

## Reporte generado

El archivo `output/report.json` contiene:
- `generatedAt` — timestamp ISO 8601 de la ejecución
- `appliedFilter` — categoría filtrada o `null` si no hay filtro
- `summary` — resumen estadístico (total, activos, inactivos, promedio, extremos, categorías)
- `items` — lista de beneficios filtrados

---

## Requisitos del sistema

- Node.js >= 22
- pnpm >= 10
