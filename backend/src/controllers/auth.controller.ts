import { RequestHandler } from 'express';
import { authService } from '../services/auth.service';
import { userValidator } from '../validators/user.validator';

export const register: RequestHandler = async (req, res, next) => {
  try {
    const data = userValidator.register.parse(req.body);
    const user = await authService.register(data);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400).json({ error: 'Email y contraseña son obligatorios' });
      return; // corta la ejecucion
    }

    const { token, user } = await authService.login(email, password);
    res.json({ token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
