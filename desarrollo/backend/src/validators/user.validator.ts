import { z } from 'zod';
export const userValidator = {
  register: z.object({
    nombre: z.string(),
    apellido: z.string(),
    dni: z.string(),
    email: z.string().email(),
    nro_celular: z.string(),
    direccion: z.object({
      calle: z.string(),
      nro_calle: z.string(),
      cod_postal: z.string(),
      id_localidad: z.number(),
    }),
    id_rol: z.number(),
    password: z.string().min(6),
    fecha_registro: z.date().or(z.string().transform(str => new Date(str))).optional(), // Hacer fecha_registro opcional
    estado: z.boolean().optional(), // Hacer estado opcional
  }),
  update: z.object({
    nombre: z.string().optional(),
    apellido: z.string().optional(),
    dni: z.string().optional(),
    email: z.string().email().optional(),
    nro_celular: z.string().optional(),
    direccion: z.object({
      id_direccion: z.number().optional(),
      calle: z.string().optional(),
      nro_calle: z.string().optional(),
      cod_postal: z.string().optional(),
      id_localidad: z.number().optional(),
    }).optional(),
    id_rol: z.number().optional(),
    password: z.string().min(6).optional(),
    estado: z.boolean().optional(),
  }),
};
