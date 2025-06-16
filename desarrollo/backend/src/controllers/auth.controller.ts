import { RequestHandler } from 'express';
import { authService } from '../services/auth.service';
import { validadorUsuario } from '../validators/user.validator';

// En este controlador se manejan las peticiones de registro y login de los usuarios

export const regitrar_usuario: RequestHandler = async (req, res, next) => {
  try {
    const data = validadorUsuario.registrar.parse(req.body);// Valida con Zod
    const user = await authService.regitrar_usuario(data);//Lógica principal
    res.status(201).json(user);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export const iniciar_sesion: RequestHandler = async (req, res, next) => {
  try {

    // valido el body con zod y luego lo desestructuro
    const { email, password } = validadorUsuario.iniciar_sesion.parse(req.body);
    // if (!email || !password) {
    //   res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    //   return; // corta la ejecucion
    // }

    const { token, user } = await authService.iniciar_sesion(email, password);
    res.json({ token, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};
