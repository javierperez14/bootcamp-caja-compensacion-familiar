// ============================================
// REPOSITORY — Acceso a datos (store en memoria)
// ============================================
import type { Benefit, CreateBenefitDto, UpdateBenefitDto } from '../types';

const store: Benefit[] = [
  {
    id: 1,
    name: 'Subsidio educativo básico',
    category: 'educacion',
    description: 'Apoyo económico para matrícula de educación básica y media de hijos de afiliados',
    maxSubsidy: 1200000,
    available: true,
    createdAt: new Date('2024-01-15').toISOString(),
  },
  {
    id: 2,
    name: 'Programa de salud preventiva',
    category: 'salud',
    description: 'Acceso a chequeos médicos preventivos, odontología y vacunación para afiliados y su familia',
    maxSubsidy: 800000,
    available: true,
    createdAt: new Date('2024-02-10').toISOString(),
  },
  {
    id: 3,
    name: 'Recreación y deporte familiar',
    category: 'recreacion',
    description: 'Descuentos en parques recreativos, piscinas y eventos culturales para afiliados',
    maxSubsidy: 400000,
    available: true,
    createdAt: new Date('2024-03-01').toISOString(),
  },
  {
    id: 4,
    name: 'Subsidio de vivienda',
    category: 'vivienda',
    description: 'Complemento al subsidio familiar de vivienda para adquisición o mejora de inmueble',
    maxSubsidy: 15000000,
    available: false,
    createdAt: new Date('2024-04-20').toISOString(),
  },
  {
    id: 5,
    name: 'Crédito de libre inversión',
    category: 'otros',
    description: 'Préstamos a tasa preferencial para afiliados con más de 6 meses de antigüedad',
    maxSubsidy: 5000000,
    available: true,
    createdAt: new Date('2024-05-05').toISOString(),
  },
];

let nextId = store.length + 1;

export async function findAll(): Promise<Benefit[]> {
  return [...store];
}

export async function findById(id: number): Promise<Benefit | undefined> {
  return store.find((benefit) => benefit.id === id);
}

export async function create(dto: CreateBenefitDto): Promise<Benefit> {
  const benefit: Benefit = {
    id: nextId++,
    ...dto,
    createdAt: new Date().toISOString(),
  };
  store.push(benefit);
  return { ...benefit };
}

export async function update(id: number, dto: UpdateBenefitDto): Promise<Benefit | undefined> {
  const index = store.findIndex((benefit) => benefit.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((benefit) => benefit.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
