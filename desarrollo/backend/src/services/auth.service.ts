import { userService } from './user.service';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/jwt';

// En este servicio se manejan las operaciones de autenticación
// como el registro y login de los usuarios

export const authService = {
  // Función para registrar un nuevo usuario,verificamos si el email ya esta registrado y buscamos/creamos direccion si es necesario
  regitrar_usuario: async (userData: any) => {
    //Verificamos si ya existe el email
    const existingUser = await userService.getUserByEmail(userData.email);
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }
    // Hasheamos la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    // Creamos el usuario
    const user = await userService.registerUser({ ...userData, password: hashedPassword });

    return user;
  },

  // Función para iniciar sesión, en nuestro diagrama de secuencia Iniciar_sesion() 
  // Verificamos si el usuario existe y si la contraseña es correcta
  iniciar_sesion: async (email: string, password: string) => {
    const user = await userService.getUserByEmail(email);
    if (!user) throw new Error('Email no encontrado');

    // Verificamos si la contraseña es correcta, comparando la contraseña hasheada
    // almacenada en la base de datos con la contraseña proporcionada
    const passwordMatch = await bcrypt.compare(password, user.password); 
    
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
