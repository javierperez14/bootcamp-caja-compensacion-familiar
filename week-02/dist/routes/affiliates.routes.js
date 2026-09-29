"use strict";
// ============================================
// RUTAS — /api/v1/affiliates
// ============================================
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
exports.affiliatesRouter = void 0;
const express_1 = require("express");
const store = __importStar(require("../store.js"));
exports.affiliatesRouter = (0, express_1.Router)();
// Campos requeridos para crear y actualizar
const REQUIRED_FIELDS = [
    'fullName',
    'documentId',
    'employerName',
    'affiliationDate',
];
// GET /api/v1/affiliates — Listar todos
exports.affiliatesRouter.get('/', (_req, res) => {
    res.json(store.getAll());
});
// GET /api/v1/affiliates/:id — Obtener por id
exports.affiliatesRouter.get('/:id', (req, res) => {
    const id = Number(req.params.id);
    const affiliate = store.getById(id);
    if (!affiliate) {
        res.status(404).json({ error: `Afiliado con id ${id} no encontrado` });
        return;
    }
    res.json(affiliate);
});
// POST /api/v1/affiliates — Crear
exports.affiliatesRouter.post('/', (req, res) => {
    const body = req.body;
    const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
    if (missing.length > 0) {
        res.status(400).json({
            error: 'Faltan campos requeridos',
            missingFields: missing,
        });
        return;
    }
    const dto = {
        fullName: body.fullName,
        documentId: body.documentId,
        employerName: body.employerName,
        affiliationDate: body.affiliationDate,
    };
    const created = store.create(dto);
    res.status(201).json(created);
});
// PUT /api/v1/affiliates/:id — Actualizar completo
exports.affiliatesRouter.put('/:id', (req, res) => {
    const id = Number(req.params.id);
    const body = req.body;
    // Validar campos requeridos antes de tocar el store
    const missing = REQUIRED_FIELDS.filter((f) => !body[f]);
    if (missing.length > 0) {
        res.status(400).json({
            error: 'Faltan campos requeridos',
            missingFields: missing,
        });
        return;
    }
    const dto = {
        fullName: body.fullName,
        documentId: body.documentId,
        employerName: body.employerName,
        affiliationDate: body.affiliationDate,
        active: body.active ?? true,
    };
    const updated = store.update(id, dto);
    if (!updated) {
        res.status(404).json({ error: `Afiliado con id ${id} no encontrado` });
        return;
    }
    res.json(updated);
});
// DELETE /api/v1/affiliates/:id — Eliminar
exports.affiliatesRouter.delete('/:id', (req, res) => {
    const id = Number(req.params.id);
    const deleted = store.remove(id);
    if (!deleted) {
        res.status(404).json({ error: `Afiliado con id ${id} no encontrado` });
        return;
    }
    res.status(204).send();
});
