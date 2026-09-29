import { Router } from 'express';
import * as controller from '../controllers/benefits.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const benefitsRouter = Router();

// Todas las rutas protegidas con authMiddleware
benefitsRouter.use(authMiddleware);

benefitsRouter.get('/', controller.getAll);
benefitsRouter.get('/:id', controller.getById);
benefitsRouter.post('/', controller.create);
benefitsRouter.patch('/:id', controller.update);
benefitsRouter.delete('/:id', controller.remove);
