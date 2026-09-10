// ============================================
// ROUTES — Solo mapeo URL → controller
// ============================================

import { Router } from 'express';
import * as controller from '../controllers/employers.controller';

export const employersRouter = Router();

employersRouter.get('/', controller.getAll);
employersRouter.get('/:id', controller.getById);
employersRouter.post('/', controller.create);
employersRouter.put('/:id', controller.update);
employersRouter.delete('/:id', controller.remove);
