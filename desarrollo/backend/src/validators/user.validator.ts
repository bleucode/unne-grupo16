import { z } from 'zod';
// Expresiones regulares para validación
const SOLO_LETRAS = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
const SOLO_NUMEROS = /^\d+$/;

export const validadorUsuario = {
  registrar: z.object({
    nombre: z.string({ message: 'Nombre requerido' })
      .min(2, { message: 'Nombre muy corto' })
      .refine(value => SOLO_LETRAS.test(value), {
        message: 'Solo se permiten letras y espacios'
      }),
    
    apellido: z.string({ message: 'Apellido requerido' })
      .min(2, { message: 'Apellido muy corto' })
      .refine(value => SOLO_LETRAS.test(value), {
        message: 'Solo se permiten letras y espacios'
      }),
    
    dni: z.string({ message: 'DNI requerido' })
      .length(8, { message: 'DNI debe tener 8 caracteres' })
      .refine(value => SOLO_NUMEROS.test(value), {
        message: 'DNI debe contener solo números'
      }),
    
    email: z.string().email({ message: 'Email inválido' }),
    
    nro_celular: z.string({ message: 'Número celular requerido' })
      .min(8, { message: 'Número muy corto' })
      .refine(value => SOLO_NUMEROS.test(value), {
        message: 'Solo se permiten números'
      }),
    
    direccion: z.object({
      calle: z.string({ message: 'Calle requerida' }),
      
      nro_calle: z.string({ message: 'Número de calle requerido' })
        .refine(value => SOLO_NUMEROS.test(value), {
          message: 'Solo números permitidos'
        }),
      
      cod_postal: z.string({ message: 'Código postal requerido' })
        .refine(value => SOLO_NUMEROS.test(value), {
          message: 'Solo números permitidos'
        }),
      
      // CORREGIDO: Para números, usar z.number() sin refine con regex
      id_localidad: z.number({ message: 'ID de localidad requerido' })
        .int({ message: 'Debe ser un número entero' })
        .positive({ message: 'Debe ser un número positivo' }),
    }),
    
    // CORREGIDO: Para números, usar z.number() sin refine con regex
    id_rol: z.number({ message: 'ID de rol requerido' })
      .int({ message: 'Debe ser un número entero' })
      .positive({ message: 'Debe ser un número positivo' }),
    
    password: z.string()
      .min(6, { message: 'Contraseña muy corta (mínimo 6 caracteres)' })
      .max(20, { message: 'Contraseña demasiado larga' }),
    
    fecha_registro: z.date()
      .or(z.string().transform(str => new Date(str)))
      .optional(),
    
    estado: z.boolean().optional(),
  }),

  iniciar_sesion: z.object({
    email: z.string().email({ message: 'Email inválido' }),
    password: z.string().min(6, { message: 'Contraseña muy corta' }),
  }),
};