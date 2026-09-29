// ============================================
// CONTROLLER — Benefits
// ============================================
import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/benefits.service';
import { createBenefitSchema, updateBenefitSchema, idParamSchema } from '../schemas/benefit.schema';
import type { SingleResponse, PaginatedResponse, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query['limit'] ?? '10'), 10) || 10));
    const result: PaginatedResponse<object> = await service.findAll({ page, limit });
    res.json(result);
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
    const parsed = createBenefitSchema.safeParse(req.body);
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
    const parsedBody = updateBenefitSchema.safeParse(req.body);
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
