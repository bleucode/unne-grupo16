import { z } from 'zod';

export const userValidator = {
  register: z.object({
    nombre: z.string(),
    apellido: z.string(),
    dni: z.string(),
    email: z.string().email(),
    nro_celular: z.string(),
    id_direccion: z.number(),
    id_rol: z.number(),
    password: z.string().min(6),
    fecha_registro: z.date().or(z.string().transform(str => new Date(str))),
    estado: z.boolean(),
  }),
  update: z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    dni: z.string().optional(),
    email: z.string().email().optional(),
    nro_celular: z.string().optional(),
    id_direccion: z.number().optional(),
    id_rol: z.number().optional(),
    password: z.string().min(6).optional(),
    estado: z.boolean().optional(),
  }),
};
