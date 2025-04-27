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
userRouter.get('/:id',
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1'),
  userController.getById);
userRouter.put('/:id', 
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1'),
  userController.update);
userRouter.delete('/:id', 
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1'),
  userController.delete);

// Activar usuario
userRouter.put(
  '/:id/activate',
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1'), // solo admin por ejemplo
  userController.activate
);
export default userRouter;