import { Router } from 'express';
import { userRouter } from './user.routes';
import { authRouter } from './auth.routes';
import { homeRouter } from './home.routes';

export const router = Router();

router.use('/', homeRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/producto', productoRouter);