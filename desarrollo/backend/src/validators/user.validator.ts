import { z } from 'zod';

export const validadorUsuario = {
  registrar: z.object({
    nombre: z.string({ message: 'Nombre requerido' }),
    apellido: z.string({ message: 'Apellido requerido' }),
    dni: z.string({ message: 'DNI requerido' }),
    email: z.string().email({ message: 'Email inválido' }),
    nro_celular: z.string({ message: 'Número celular requerido' }),
    direccion: z.object({
      calle: z.string({ message: 'Calle requerida' }),
      nro_calle: z.string({ message: 'Número de calle requerido' }),
      cod_postal: z.string({ message: 'Código postal requerido' }),
      id_localidad: z.number({ message: 'ID de localidad requerido' }),
    }),
    id_rol: z.number({ message: 'ID de rol requerido' }),
    password: z.string().min(6, { message: 'Contraseña muy corta' }),
    fecha_registro: z.date().or(z.string().transform(str => new Date(str))).optional(),
    estado: z.boolean().optional(),
  }),
  actualizar: z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    dni: z.string().optional(),
    email: z.string().email({ message: 'Email inválido' }).optional(),
    nro_celular: z.string().optional(),
    direccion: z.object({
      id_direccion: z.number().optional(),
      calle: z.string().optional(),
      nro_calle: z.string().optional(),
      cod_postal: z.string().optional(),
      id_localidad: z.number().optional(),
    }).optional(),
    id_rol: z.number().optional(),
    password: z.string().min(6, { message: 'Contraseña muy corta' }).optional(),
    estado: z.boolean().optional(),
  }),
  iniciar_sesion: z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'Contraseña muy corta' }),
  }),
};
