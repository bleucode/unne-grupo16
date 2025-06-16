import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

export const authMiddleware = {
    verifyToken: (req: Request, res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ message: 'Token no proporcionado' });
      return; 
    }

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, jwtConfig.secret);
      (req as any).user = decoded;
      return next(); 
    } catch (error) {
      res.status(401).json({ message: 'Token inválido o expirado' });
      return; 
    }
  }
};