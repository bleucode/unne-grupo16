import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

export const userRouter = Router();

// userRouter.post('/register', userController.r);
userRouter.get(
    '/allusers',
    authMiddleware.verifyToken,
    roleMiddleware.authorizeRoles('3'), // Solo Admin
    userController.getAll
  );
userRouter.get('/me', authMiddleware.verifyToken, userController.getMe); // <--- primero la ruta 'me'
userRouter.get('/address/:id', userController.getAddressById);          // luego 'address/:id'
userRouter.get('/:id', userController.getById);                         // y al final el catch-all '/:id'
userRouter.put('/:id', authMiddleware.verifyToken, userController.update);
userRouter.delete('/:id', userController.delete);

export default userRouter;