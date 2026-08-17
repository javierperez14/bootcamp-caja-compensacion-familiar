// ============================================
// CONTROLLER — Interfaz HTTP (thin controller)
// ============================================
// Exactamente 3 pasos por handler: extraer → llamar service → responder
// Sin lógica de negocio. Siempre next(err) en el catch.
import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/benefits.service';
import {
  createBenefitSchema,
  updateBenefitSchema,
  idParamSchema,
} from '../schemas/benefit.schema';
import type { SingleResponse, PaginatedResponse, ErrorResponse } from '../types';
import type { Benefit } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(String(req.query['limit'] ?? '10'), 10) || 10));

    const result: PaginatedResponse<Benefit> = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      const response: ErrorResponse = {
        error: 'Validation Error',
        message: 'El parámetro id no es válido',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      };
      res.status(400).json(response);
      return;
    }

    const benefit = await service.findById(parsed.data.id);
    const response: SingleResponse<Benefit> = { data: benefit };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = createBenefitSchema.safeParse(req.body);
    if (!parsed.success) {
      const response: ErrorResponse = {
        error: 'Validation Error',
        message: 'Los datos enviados no son válidos',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      };
      res.status(400).json(response);
      return;
    }

    const benefit = await service.create(parsed.data);
    const response: SingleResponse<Benefit> = { data: benefit };
    res.status(201).json(response);
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsedId = idParamSchema.safeParse(req.params);
    if (!parsedId.success) {
      const response: ErrorResponse = {
        error: 'Validation Error',
        message: 'El parámetro id no es válido',
        issues: parsedId.error.issues.map((i) => ({ path: i.path, message: i.message })),
      };
      res.status(400).json(response);
      return;
    }

    const parsedBody = updateBenefitSchema.safeParse(req.body);
    if (!parsedBody.success) {
      const response: ErrorResponse = {
        error: 'Validation Error',
        message: 'Los datos enviados no son válidos',
        issues: parsedBody.error.issues.map((i) => ({ path: i.path, message: i.message })),
      };
      res.status(400).json(response);
      return;
    }

    const benefit = await service.update(parsedId.data.id, parsedBody.data);
    const response: SingleResponse<Benefit> = { data: benefit };
    res.json(response);
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const parsed = idParamSchema.safeParse(req.params);
    if (!parsed.success) {
      const response: ErrorResponse = {
        error: 'Validation Error',
        message: 'El parámetro id no es válido',
        issues: parsed.error.issues.map((i) => ({ path: i.path, message: i.message })),
      };
      res.status(400).json(response);
      return;
    }

    await service.remove(parsed.data.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
