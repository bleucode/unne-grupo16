import { z } from 'zod';

export const productValidator = {
  create: z.object({
    nombre: z.string(),
    descripcion: z.string(),
    especificacion: z.string(),
    precio: z.number(),
    precio_descuento: z.number(),
    stock: z.number(),
    imagen: z.string(),
    id_modelo: z.number(),
    id_categoria: z.number(),
    id_marca: z.number(),
    activo: z.boolean().optional(),
  }),

  update: z.object({
    nombre: z.string().optional(),
    descripcion: z.string().optional(),
    especificacion: z.string().optional(),
    precio: z.number().optional(),
    precio_descuento: z.number().optional(),
    stock: z.number().optional(),
    imagen: z.string().optional(),
    id_modelo: z.number().optional(),
    id_categoria: z.number().optional(),
    id_marca: z.number().optional(),
    activo: z.boolean().optional(),
  }),
};

