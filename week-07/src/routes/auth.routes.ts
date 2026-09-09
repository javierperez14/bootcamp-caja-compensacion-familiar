import { Router } from 'express';
import * as controller from '../controllers/auth.controller';
import { authMiddleware } from '../middlewares/auth.middleware';

export const authRouter = Router();

authRouter.post('/register', controller.register);
authRouter.post('/login', controller.login);
authRouter.post('/refresh', controller.refresh);
authRouter.post('/logout', authMiddleware, controller.logout);
authRouter.get('/me', authMiddleware, controller.me);
