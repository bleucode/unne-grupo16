import { Request, Response, NextFunction } from 'express';

export const roleMiddleware = {
  authorizeRoles: (...allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
      const user = (req as any).user;
      if (!user) {
         res.status(401).json({ message: 'Usuario no autenticado' });
         return
      }

      if (!allowedRoles.includes(user.id_rol.toString())) {
        res.status(403).json({ message: 'Acceso denegado: rol insuficiente' });
        return
      }

      return next();
    };
  },
};
