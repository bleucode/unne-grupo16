import { Router } from 'express';
import { productController } from '../controllers/product.controller';
import { authMiddleware } from '../middlewares/auth.middleware';
import { roleMiddleware } from '../middlewares/role.middleware';

export const productRouter = Router();

// Listar productos (público)
productRouter.get('/', productController.getAll);

// Ver producto por ID (público)
productRouter.get('/:id', productController.getById);

// Crear producto (Vendedor y ADMIN)
productRouter.post(
  '/',
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1','2'),
  productController.create
);

// Actualizar producto (Vendedor y ADMIN)
productRouter.put(
  '/:id',
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1','2'),
  productController.update
);

// Eliminar producto (Vendedor y ADMIN)
productRouter.delete(
  '/:id',
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles('1','2'),
  productController.delete
);

// export default productRouter;
