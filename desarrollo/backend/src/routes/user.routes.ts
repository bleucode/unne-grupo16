import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

export const userRouter = Router();

// userRouter.post('/register', userController.r);
userRouter.get(
    '/allusers',
    authMiddleware.verifyToken,
    roleMiddleware.authorizeRoles('1'), // Solo Admin
    userController.getAll
  );
userRouter.get('/:id',  authMiddleware.verifyToken,userController.getById);
userRouter.get('/address/:id',  authMiddleware.verifyToken,userController.getAddressById);
userRouter.put('/:id',  authMiddleware.verifyToken,userController.update);
userRouter.delete('/:id', authMiddleware.verifyToken, userController.delete);

export default userRouter;