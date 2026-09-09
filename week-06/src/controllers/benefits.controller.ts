import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/benefits.service';
import { createBenefitSchema, updateBenefitSchema, idParamSchema } from '../schemas/benefit.schema';
export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query['limit'] ?? '10'), 10) || 10));
    res.json(await service.findAll(page, limit));
  } catch (err) { next(err); }
}
export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) { res.status(400).json({ error: 'Validation Error', message: p.error.issues[0]?.message }); return; }
    res.json({ data: await service.findById(p.data.id) });
  } catch (err) { next(err); }
}
export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = createBenefitSchema.safeParse(req.body);
    if (!p.success) { res.status(400).json({ error: 'Validation Error', message: 'Datos inválidos', issues: p.error.issues.map((i) => ({ path: i.path, message: i.message })) }); return; }
    res.status(201).json({ data: await service.create(p.data) });
  } catch (err) { next(err); }
}
export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const pId = idParamSchema.safeParse(req.params);
    if (!pId.success) { res.status(400).json({ error: 'Validation Error', message: pId.error.issues[0]?.message }); return; }
    const pBody = updateBenefitSchema.safeParse(req.body);
    if (!pBody.success) { res.status(400).json({ error: 'Validation Error', message: 'Datos inválidos', issues: pBody.error.issues.map((i) => ({ path: i.path, message: i.message })) }); return; }
    res.json({ data: await service.update(pId.data.id, pBody.data) });
  } catch (err) { next(err); }
}
export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const p = idParamSchema.safeParse(req.params);
    if (!p.success) { res.status(400).json({ error: 'Validation Error', message: p.error.issues[0]?.message }); return; }
    await service.remove(p.data.id);
    res.status(204).send();
  } catch (err) { next(err); }
}
