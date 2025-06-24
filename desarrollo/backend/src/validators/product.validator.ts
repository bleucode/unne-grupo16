import { z } from 'zod';

export const productValidator = {
  create: z.object({
    nombre: z.string()
      .min(1, 'El nombre es requerido')
      .max(255, 'El nombre no puede exceder 255 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.]+$/, 'El nombre solo puede contener letras, números, espacios y caracteres básicos'),
    
    descripcion: z.string()
      .min(1, 'La descripción es requerida')
      .max(1000, 'La descripción no puede exceder 1000 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.,:;()!?]+$/, 'La descripción solo puede contener letras, números y signos de puntuación básicos'),
    
    especificacion: z.string()
      .min(1, 'La especificación es requerida')
      .max(1000, 'La especificación no puede exceder 1000 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.,:;()!?]+$/, 'La especificación solo puede contener letras, números y signos de puntuación básicos'),
    
    precio: z.number()
      .positive('El precio debe ser un número positivo')
      .max(999999.99, 'El precio no puede exceder 999,999.99')
      .refine(val => Number.isFinite(val), 'El precio debe ser un número válido'),
    
    precio_descuento: z.number()
      .nonnegative('El precio de descuento no puede ser negativo')
      .max(999999.99, 'El precio de descuento no puede exceder 999,999.99')
      .refine(val => Number.isFinite(val), 'El precio de descuento debe ser un número válido'),
    
    stock: z.number()
      .int('El stock debe ser un número entero')
      .nonnegative('El stock no puede ser negativo')
      .max(999999, 'El stock no puede exceder 999,999 unidades'),
    
    imagen: z.string()
      .min(1, 'La imagen es requerida')
      .max(500, 'La URL de la imagen no puede exceder 500 caracteres'),
    
    id_modelo: z.number()
      .int('El ID del modelo debe ser un número entero')
      .positive('El ID del modelo debe ser un número positivo'),
    
    id_categoria: z.number()
      .int('El ID de la categoría debe ser un número entero')
      .positive('El ID de la categoría debe ser un número positivo'),
    
    id_marca: z.number()
      .int('El ID de la marca debe ser un número entero')
      .positive('El ID de la marca debe ser un número positivo'),
    
    activo: z.boolean().optional(),
  })
  .refine(data => data.precio_descuento <= data.precio, {
    message: 'El precio de descuento no puede ser mayor al precio original',
    path: ['precio_descuento'],
  }),

  update: z.object({
    nombre: z.string()
      .min(1, 'El nombre no puede estar vacío')
      .max(255, 'El nombre no puede exceder 255 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.]+$/, 'El nombre solo puede contener letras, números, espacios y caracteres básicos')
      .optional(),
    
    descripcion: z.string()
      .min(1, 'La descripción no puede estar vacía')
      .max(1000, 'La descripción no puede exceder 1000 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.,:;()!?]+$/, 'La descripción solo puede contener letras, números y signos de puntuación básicos')
      .optional(),
    
    especificacion: z.string()
      .min(1, 'La especificación no puede estar vacía')
      .max(1000, 'La especificación no puede exceder 1000 caracteres')
      .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ0-9\s\-_.,:;()!?]+$/, 'La especificación solo puede contener letras, números y signos de puntuación básicos')
      .optional(),
    
    precio: z.number()
      .positive('El precio debe ser un número positivo')
      .max(999999.99, 'El precio no puede exceder 999,999.99')
      .refine(val => Number.isFinite(val), 'El precio debe ser un número válido')
      .optional(),
    
    precio_descuento: z.number()
      .nonnegative('El precio de descuento no puede ser negativo')
      .max(999999.99, 'El precio de descuento no puede exceder 999,999.99')
      .refine(val => Number.isFinite(val), 'El precio de descuento debe ser un número válido')
      .optional(),
    
    stock: z.number()
      .int('El stock debe ser un número entero')
      .nonnegative('El stock no puede ser negativo')
      .max(999999, 'El stock no puede exceder 999,999 unidades')
      .optional(),
    
    imagen: z.string()
      .min(1, 'La imagen no puede estar vacía')
      .max(500, 'La URL de la imagen no puede exceder 500 caracteres')
      .optional(),
    
    id_modelo: z.number()
      .int('El ID del modelo debe ser un número entero')
      .positive('El ID del modelo debe ser un número positivo')
      .optional(),
    
    id_categoria: z.number()
      .int('El ID de la categoría debe ser un número entero')
      .positive('El ID de la categoría debe ser un número positivo')
      .optional(),
    
    id_marca: z.number()
      .int('El ID de la marca debe ser un número entero')
      .positive('El ID de la marca debe ser un número positivo')
      .optional(),
    
    activo: z.boolean().optional(),
  })
  .refine(data => {
    // Solo validar si ambos campos están presentes
    if (data.precio !== undefined && data.precio_descuento !== undefined) {
      return data.precio_descuento <= data.precio;
    }
    return true;
  }, {
    message: 'El precio de descuento no puede ser mayor al precio original',
    path: ['precio_descuento'],
  }),
};