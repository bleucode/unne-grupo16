import { Request, Response } from 'express';
import { userService } from '../services/user.service';
import { userValidator } from '../validators/user.validator';
//import { userRepository } from '../repositories/user.repository';

export const userController = {
  register: async (req: Request, res: Response) => {
    try {
      const data = userValidator.register.parse(req.body);
      const newUser = await userService.registerUser(data);
      res.status(201).json(newUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  getAll: async (_req: Request, res: Response) => {
    const users = await userService.getAllUsers();
    res.json(users);
  },

  getById: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id, 10); // Convertir ID a número
      if (isNaN(id)) {
         res.status(400).json({ error: 'ID inválido' });
         return
      }

      const user = await userService.getUserById(id);
      if (!user) {
         res.status(404).json({ error: 'Usuario no encontrado' });
         return
      }

       res.json(user); // ✅ Devuelve la respuesta correctamente
       return
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error interno del servidor' });
      return
    }
  },

  update: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const data = userValidator.update.parse(req.body);
      const updatedUser = await userService.updateUser(id, data);
      res.json(updatedUser);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  delete: async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    await userService.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  },
  async activate(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const user = await userService.activateUser(id);
      res.json({ message: 'Usuario activado exitosamente', user });
    } catch (error) {
      res.status(500).json({ message: 'Error al activar usuario', error });
    }
  },
};
