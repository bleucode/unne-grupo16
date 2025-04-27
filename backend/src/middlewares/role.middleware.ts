import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = {
  authorizeRoles: (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user; 
      const userRole = (user && user.id_rol) ? user.id_rol.toString() : null; 
      
      if (!user) {
        res.status(401).json({ message: 'Usuario no autenticado' });
        return
      }

      // Si el rol del usuario no está permitido, devuelve acceso denegado
      if (!allowedRoles.includes(userRole)) {
         res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
         return
      }

      return next(); // Si el rol está permitido, pasa al siguiente middleware o controlador
    };
  },
};
