"use strict";
// ============================================
// SERVICE — Lógica de negocio
// ============================================
// Reglas:
// - CERO imports de Express
// - Paginación y validaciones de dominio aquí
// - Retorna undefined cuando no existe; el controller maneja el 404
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.findAll = findAll;
exports.findById = findById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const repo = __importStar(require("../repositories/employers.repository"));
async function findAll(params) {
    const { page, limit } = params;
    const all = await repo.findAll();
    const start = (page - 1) * limit;
    const data = all.slice(start, start + limit);
    return { data, total: all.length, page, limit };
}
async function findById(id) {
    return repo.findById(id);
}
async function create(dto) {
    return repo.create(dto);
}
async function update(id, dto) {
    const exists = await repo.findById(id);
    if (!exists)
        return undefined;
    return repo.update(id, dto);
}
async function remove(id) {
    const exists = await repo.findById(id);
    if (!exists)
        return false;
    return repo.remove(id);
}
