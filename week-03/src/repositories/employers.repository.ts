// ============================================
// REPOSITORY — Único punto de acceso a datos
// ============================================
// Reglas:
// - Solo esta capa toca el store
// - Todos los métodos son async Promise<T>
// - Retorna copias defensivas (nunca referencias internas)
// - Si no encuentra un elemento retorna undefined

import type { Employer, CreateEmployerDto, UpdateEmployerDto } from '../types';

const store: Employer[] = [
  {
    id: 1,
    companyName: 'Construcciones Bogotá SAS',
    nit: '900123456-1',
    contactEmail: 'rrhh@construccionesbogota.com',
    sector: 'privado',
    employeeCount: 120,
    active: true,
    createdAt: '2023-01-10T08:00:00.000Z',
  },
  {
    id: 2,
    companyName: 'Alcaldía Municipal de Soacha',
    nit: '800987654-2',
    contactEmail: 'talento@alcaldiasoacha.gov.co',
    sector: 'publico',
    employeeCount: 350,
    active: true,
    createdAt: '2023-03-15T09:30:00.000Z',
  },
  {
    id: 3,
    companyName: 'Textiles del Valle SA',
    nit: '890456123-3',
    contactEmail: 'nomina@textilesvalle.com',
    sector: 'privado',
    employeeCount: 85,
    active: true,
    createdAt: '2023-06-01T11:00:00.000Z',
  },
  {
    id: 4,
    companyName: 'Empresa Mixta de Acueducto',
    nit: '700345678-4',
    contactEmail: 'contacto@acueductomixto.com',
    sector: 'mixto',
    employeeCount: 200,
    active: false,
    createdAt: '2022-11-20T07:00:00.000Z',
  },
  {
    id: 5,
    companyName: 'Logística Express Ltda',
    nit: '901234567-5',
    contactEmail: 'admin@logisticaexpress.co',
    sector: 'privado',
    employeeCount: 60,
    active: true,
    createdAt: '2024-02-14T10:00:00.000Z',
  },
];

let nextId = 6;

export async function findAll(): Promise<Employer[]> {
  return [...store];
}

export async function findById(id: number): Promise<Employer | undefined> {
  const found = store.find((e) => e.id === id);
  return found ? { ...found } : undefined;
}

export async function create(dto: CreateEmployerDto): Promise<Employer> {
  const employer: Employer = {
    id: nextId++,
    ...dto,
    createdAt: new Date().toISOString(),
  };
  store.push(employer);
  return { ...employer };
}

export async function update(id: number, dto: UpdateEmployerDto): Promise<Employer | undefined> {
  const index = store.findIndex((e) => e.id === id);
  if (index === -1) return undefined;
  store[index] = { ...store[index]!, ...dto };
  return { ...store[index]! };
}

export async function remove(id: number): Promise<boolean> {
  const index = store.findIndex((e) => e.id === id);
  if (index === -1) return false;
  store.splice(index, 1);
  return true;
}
