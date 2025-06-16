import { z } from "zod";

export const ventaValidator = z.object({
  clienteId: z.number(),            // id del usuario que compra
  idMetodoPago: z.number(),           // id de TipoPago seleccionado
  cuotaId: z.number().optional(),
  direccionEnvioId: z.number(),     // id de Direccion donde quiere envío
  items: z.array( z.object({
    productoId: z.number(),
    cantidad: z.number().int().positive(),
  }) ).min(1, "El carrito no puede estar vacío"),
});
