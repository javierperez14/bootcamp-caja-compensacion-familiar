// ============================================
// CONTROLLER — Interfaz HTTP (thin controller)
// ============================================
// Reglas:
// - Exactamente 3 pasos: extraer → llamar service → responder
// - Sin lógica de negocio
// - Maneja 404 cuando el service retorna undefined
// - Siempre try/catch con next(err)

import type { Request, Response, NextFunction } from 'express';
import * as service from '../services/employers.service';
import type { CreateEmployerDto, UpdateEmployerDto, ErrorResponse } from '../types';

export async function getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10) || 1);
    const limit = Math.max(1, parseInt(String(req.query['limit'] ?? '10'), 10) || 10);
    const result = await service.findAll({ page, limit });
    res.json(result);
  } catch (err) {
    next(err);
  }
}

export async function getById(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(String(req.params['id']), 10);
    const employer = await service.findById(id);
    if (!employer) {
      const body: ErrorResponse = { error: 'Not Found', message: `Employer ${id} not found` };
      res.status(404).json(body);
      return;
    }
    res.json({ data: employer });
  } catch (err) {
    next(err);
  }
}

export async function create(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const dto = req.body as CreateEmployerDto;
    const employer = await service.create(dto);
    res.status(201).json({ data: employer });
  } catch (err) {
    next(err);
  }
}

export async function update(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(String(req.params['id']), 10);
    const dto = req.body as UpdateEmployerDto;
    const employer = await service.update(id, dto);
    if (!employer) {
      const body: ErrorResponse = { error: 'Not Found', message: `Employer ${id} not found` };
      res.status(404).json(body);
      return;
    }
    res.json({ data: employer });
  } catch (err) {
    next(err);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const id = parseInt(String(req.params['id']), 10);
    const deleted = await service.remove(id);
    if (!deleted) {
      const body: ErrorResponse = { error: 'Not Found', message: `Employer ${id} not found` };
      res.status(404).json(body);
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}
