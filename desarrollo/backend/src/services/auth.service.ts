import { userService } from './user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';
import { isEmail } from 'validator';

export const authService = {
  register: async (userData: any) => {
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user = await userService.registerUser({ ...userData, password: hashedPassword });

    return user;
  },

  login: async (email: string, password: string) => {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new Error('Email no encontrado');

    console.log("Contraseña ingresada:", password);  // Verifica la contraseña ingresada
    console.log("Contraseña guardada (hash):", user.password);  // Verifica el hash almacenado

    const passwordMatch = await bcrypt.compare(password, user.password); // Compara directamente las contraseñas sin hash
    console.log("¿Contraseña coincide?", passwordMatch);  // Verifica el resultado de la comparación

    if (!passwordMatch) throw new Error('Contraseña incorrecta');

    const token = jwt.sign(
      {
        id_usuario: user.id_usuario,
        email: user.email,
        nombre: user.nombre,
        id_rol: user.id_rol,
      },
      jwtConfig.secret,
      { expiresIn: jwtConfig.expiresIn }
    );

    return { token, user };
  },
};
