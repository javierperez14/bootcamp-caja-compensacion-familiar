// ============================================
// CONTROLLER — Categories
// ============================================
import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/categories.service';
import { createCategorySchema, updateCategorySchema, idParamSchema } from '../schemas/benefit.schema';
import type { SingleResponse, ErrorResponse } from '../types';

export async function getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = await service.findAll();
    res.json({ data });
  } catch (err) { next(err); }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'El id no es válido',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) } as ErrorResponse);
      return;
    }
    const data = await service.findById(parsed.data.id);
    res.json({ data } as SingleResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createCategorySchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Los datos no son válidos',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) } as ErrorResponse);
      return;
    }
    const data = await service.create(parsed.data);
    res.status(201).json({ data } as SingleResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idParamSchema.safeParse(req.params);
    if (!parsedId.success) {
      res.status(400).json({ error: 'Validation Error', message: 'El id no es válido',
        issues: parsedId.error.issues.map((i) => ({ path: i.path, message: i.message })) } as ErrorResponse);
      return;
    }
    const parsedBody = updateCategorySchema.safeParse(req.body);
    if (!parsedBody.success) {
      res.status(400).json({ error: 'Validation Error', message: 'Los datos no son válidos',
        issues: parsedBody.error.issues.map((i) => ({ path: i.path, message: i.message })) } as ErrorResponse);
      return;
    }
    const data = await service.update(parsedId.data.id, parsedBody.data);
    res.json({ data } as SingleResponse<typeof data>);
  } catch (err) { next(err); }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      res.status(400).json({ error: 'Validation Error', message: 'El id no es válido',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })) } as ErrorResponse);
      return;
    }
    await service.remove(parsed.data.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
