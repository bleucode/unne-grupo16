import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware';
import { regitrar_usuario, iniciar_sesion } from '../controllers/auth.controller';

export const authRouter = Router();

authRouter.post('/register', regitrar_usuario);
authRouter.post('/login', iniciar_sesion);
