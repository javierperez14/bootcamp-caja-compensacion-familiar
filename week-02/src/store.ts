// ============================================
// STORE — Store en memoria para Affiliates
// Simula una base de datos sin persistencia
// ============================================

import type { Affiliate, CreateAffiliateDto, UpdateAffiliateDto } from './types.js';

const affiliates: Affiliate[] = [];
let nextId = 1;

/** Retorna todos los afiliados */
export function getAll(): Affiliate[] {
  return affiliates;
}

/** Retorna un afiliado por id, o undefined si no existe */
export function getById(id: number): Affiliate | undefined {
  return affiliates.find((a) => a.id === id);
}

/** Crea un nuevo afiliado con id autoincremental y active=true */
export function create(data: CreateAffiliateDto): Affiliate {
  const newAffiliate: Affiliate = {
    id: nextId++,
    ...data,
    active: true,
  };
  affiliates.push(newAffiliate);
  return newAffiliate;
}

/** Actualiza un afiliado existente; retorna el actualizado o undefined si no existe */
export function update(id: number, data: UpdateAffiliateDto): Affiliate | undefined {
  const index = affiliates.findIndex((a) => a.id === id);
  if (index === -1) return undefined;

  affiliates[index] = { id, ...data };
  return affiliates[index];
}

/** Elimina un afiliado; retorna true si existía, false si no */
export function remove(id: number): boolean {
  const index = affiliates.findIndex((a) => a.id === id);
  if (index === -1) return false;

  affiliates.splice(index, 1);
  return true;
}
