import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

export const userRouter = Router();

userRouter.post('/register', userController.register);
userRouter.get(
    '/allusers',
    authMiddleware.verifyToken,
    roleMiddleware.authorizeRoles('1'), // Solo Admin
    userController.getAll
  );
userRouter.get('/:id', userController.getById);
userRouter.get('/address/:id', userController.getAddressById);
userRouter.put('/:id', userController.update);
userRouter.delete('/:id', userController.delete);

export default userRouter;