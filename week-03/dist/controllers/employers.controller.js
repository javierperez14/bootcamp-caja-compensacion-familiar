"use strict";
// ============================================
// CONTROLLER — Interfaz HTTP (thin controller)
// ============================================
// Reglas:
// - Exactamente 3 pasos: extraer → llamar service → responder
// - Sin lógica de negocio
// - Maneja 404 cuando el service retorna undefined
// - Siempre try/catch con next(err)
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
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const service = __importStar(require("../services/employers.service"));
async function getAll(req, res, next) {
    try {
        const page = Math.max(1, parseInt(String(req.query['page'] ?? '1'), 10) || 1);
        const limit = Math.max(1, parseInt(String(req.query['limit'] ?? '10'), 10) || 10);
        const result = await service.findAll({ page, limit });
        res.json(result);
    }
    catch (err) {
        next(err);
    }
}
async function getById(req, res, next) {
    try {
        const id = parseInt(String(req.params['id']), 10);
        const employer = await service.findById(id);
        if (!employer) {
            const body = { error: 'Not Found', message: `Employer ${id} not found` };
            res.status(404).json(body);
            return;
        }
        res.json({ data: employer });
    }
    catch (err) {
        next(err);
    }
}
async function create(req, res, next) {
    try {
        const dto = req.body;
        const employer = await service.create(dto);
        res.status(201).json({ data: employer });
    }
    catch (err) {
        next(err);
    }
}
async function update(req, res, next) {
    try {
        const id = parseInt(String(req.params['id']), 10);
        const dto = req.body;
        const employer = await service.update(id, dto);
        if (!employer) {
            const body = { error: 'Not Found', message: `Employer ${id} not found` };
            res.status(404).json(body);
            return;
        }
        res.json({ data: employer });
    }
    catch (err) {
        next(err);
    }
}
async function remove(req, res, next) {
    try {
        const id = parseInt(String(req.params['id']), 10);
        const deleted = await service.remove(id);
        if (!deleted) {
            const body = { error: 'Not Found', message: `Employer ${id} not found` };
            res.status(404).json(body);
            return;
        }
        res.status(204).send();
    }
    catch (err) {
        next(err);
    }
}
