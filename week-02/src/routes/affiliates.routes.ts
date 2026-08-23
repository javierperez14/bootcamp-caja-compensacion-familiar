// ============================================
// RUTAS — /api/v1/affiliates
// ============================================

import { Router } from 'express';
import type { Request, Response } from 'express';
import * as store from '../store.js';
import type { CreateAffiliateDto, UpdateAffiliateDto } from '../types.js';

export const affiliatesRouter = Router();

// Campos requeridos para crear y actualizar
const REQUIRED_FIELDS: (keyof CreateAffiliateDto)[] = [
  'fullName',
  'documentId',
  'employerName',
  'affiliationDate',
];

// GET /api/v1/affiliates — Listar todos
affiliatesRouter.get('/', (_req: Request, res: Response) => {
  res.json(store.getAll());
});

// GET /api/v1/affiliates/:id — Obtener por id
affiliatesRouter.get('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const affiliate = store.getById(id);

  if (!affiliate) {
    res.status(404).json({ error: `Afiliado con id ${id} no encontrado` });
    return;
  }

  res.json(affiliate);
});

// POST /api/v1/affiliates — Crear
affiliatesRouter.post('/', (req: Request, res: Response) => {
  const body = req.body as Partial<CreateAffiliateDto>;

  const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
  if (missing.length > 0) {
    res.status(400).json({
      error: 'Faltan campos requeridos',
      missingFields: missing,
    });
    return;
  }

  const dto: CreateAffiliateDto = {
    fullName: body.fullName!,
    documentId: body.documentId!,
    employerName: body.employerName!,
    affiliationDate: body.affiliationDate!,
  };

  const created = store.create(dto);
  res.status(201).json(created);
});

// PUT /api/v1/affiliates/:id — Actualizar completo
affiliatesRouter.put('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const body = req.body as Partial<UpdateAffiliateDto>;

  // Validar campos requeridos antes de tocar el store
  const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
  if (missing.length > 0) {
    res.status(400).json({
      error: 'Faltan campos requeridos',
      missingFields: missing,
    });
    return;
  }

  const dto: UpdateAffiliateDto = {
    fullName: body.fullName!,
    documentId: body.documentId!,
    employerName: body.employerName!,
    affiliationDate: body.affiliationDate!,
    active: body.active ?? true,
  };

  const updated = store.update(id, dto);
  if (!updated) {
    res.status(404).json({ error: `Afiliado con id ${id} no encontrado` });
    return;
  }

  res.json(updated);
});

// DELETE /api/v1/affiliates/:id — Eliminar
affiliatesRouter.delete('/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const deleted = store.remove(id);

  if (!deleted) {
    res.status(404).json({ error: `Afiliado con id ${id} no encontrado` });
    return;
  }

  res.status(204).send();
});
