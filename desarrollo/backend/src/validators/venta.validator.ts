import { z } from "zod";

// export const ventaValidator = z.object({
//   clienteId: z.number(),            // id del usuario que compra
//   idMetodoPago: z.number(),           // id de TipoPago seleccionado
//   cuotaId: z.number().optional(),
//   direccionEnvioId: z.number(),     // id de Direccion donde quiere envío
//   items: z.array( z.object({
//     productoId: z.number(),
//     cantidad: z.number().int().positive(),
//   }) ).min(1, "El carrito no puede estar vacío"),
// });


export const ventaValidator = z.object({
  clienteId: z.number()
    .int('El ID del cliente debe ser un número entero')
    .positive('El ID del cliente debe ser un número positivo'),
  
  idMetodoPago: z.number()
    .int('El ID del método de pago debe ser un número entero')
    .positive('El ID del método de pago debe ser un número positivo'),
  
  cuotaId: z.number()
    .int('El ID de la cuota debe ser un número entero')
    .positive('El ID de la cuota debe ser un número positivo')
    .optional(),
  
  direccionEnvioId: z.number()
    .int('El ID de la dirección de envío debe ser un número entero')
    .positive('El ID de la dirección de envío debe ser un número positivo'),
  
  items: z.array(
    z.object({
      productoId: z.number()
        .int('El ID del producto debe ser un número entero')
        .positive('El ID del producto debe ser un número positivo'),
      
      cantidad: z.number()
        .int('La cantidad debe ser un número entero')
        .positive('La cantidad debe ser mayor a 0')
        .max(999, 'La cantidad no puede exceder 999 unidades por producto'),
    })
  )
  .min(1, "El carrito no puede estar vacío")
  .max(50, "El carrito no puede tener más de 50 productos diferentes")
  .refine(items => {
    // Verificar que no haya productos duplicados
    const productIds = items.map(item => item.productoId);
    const uniqueIds = new Set(productIds);
    return productIds.length === uniqueIds.size;
  }, {
    message: "No se pueden agregar productos duplicados al carrito",
    path: ["items"]
  })
  .refine(items => {
    // Verificar que la cantidad total no sea excesiva
    const totalItems = items.reduce((sum, item) => sum + item.cantidad, 0);
    return totalItems <= 9999;
  }, {
    message: "La cantidad total de productos no puede exceder 9,999 unidades",
    path: ["items"]
  }),
});