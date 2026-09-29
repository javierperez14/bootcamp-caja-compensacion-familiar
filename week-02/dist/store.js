"use strict";
// ============================================
// STORE — Store en memoria para Affiliates
// Simula una base de datos sin persistencia
// ============================================
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const affiliates = [];
let nextId = 1;
/** Retorna todos los afiliados */
function getAll() {
    return affiliates;
}
/** Retorna un afiliado por id, o undefined si no existe */
function getById(id) {
    return affiliates.find((a) => a.id === id);
}
/** Crea un nuevo afiliado con id autoincremental y active=true */
function create(data) {
    const newAffiliate = {
        id: nextId++,
        ...data,
        active: true,
    };
    affiliates.push(newAffiliate);
    return newAffiliate;
}
/** Actualiza un afiliado existente; retorna el actualizado o undefined si no existe */
function update(id, data) {
    const index = affiliates.findIndex((a) => a.id === id);
    if (index === -1)
        return undefined;
    affiliates[index] = { id, ...data };
    return affiliates[index];
}
/** Elimina un afiliado; retorna true si existía, false si no */
function remove(id) {
    const index = affiliates.findIndex((a) => a.id === id);
    if (index === -1)
        return false;
    affiliates.splice(index, 1);
    return true;
}
