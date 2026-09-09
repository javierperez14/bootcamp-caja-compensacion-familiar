import { Router } from 'express';
import * as controller from '../controllers/benefits.controller';
export const benefitsRouter = Router();
benefitsRouter.get('/', controller.getAll);
benefitsRouter.get('/:id', controller.getById);
benefitsRouter.post('/', controller.create);
benefitsRouter.put('/:id', controller.update);
benefitsRouter.delete('/:id', controller.remove);
