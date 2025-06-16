import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const ventaService = {
  async createVenta(payload: {
    clienteId: number;
    idMetodoPago : number;
    cuotaId?: number;
    direccionEnvioId: number;
    items: { productoId: number; cantidad: number }[];
  }) {
    return prisma.$transaction(async (tx) => {
      //  Validar cuota según métodoPago
        // 1) Validar cuota según métodoPago
        
      const metodo = await tx.metodoPago.findUnique({
        where: { id_metodo_pago: payload.idMetodoPago },
        include: { 
          cuotas: true ,
          categoriaPago: true,
        },
      });
      if (!metodo) throw new Error("Método de pago inválido");
      if (metodo.categoriaPago.nombre === "credito") {
        if (!payload.cuotaId || !metodo.cuotas.some(c => c.id_cuota === payload.cuotaId)) {
          throw new Error("Cuota inválida para este método de pago");
        }
      }
      //  Calcular total y actualizar stock
      let total = 0;
      for (const { productoId, cantidad } of payload.items) {
        const prod = await tx.producto.findUnique({
          where: { id_producto: productoId },
        });
        if (!prod || !prod.activo) {
          throw new Error(`Producto ${productoId} no disponible`);
        }
        if (prod.stock < cantidad) {
          throw new Error(
            `Stock insuficiente para producto ${productoId}`
          );
        }
        total += prod.precio_descuento * cantidad;
      }

      //Crear la venta
      const venta = await tx.venta.create({
        data: {
          fecha_venta: new Date(),
          total_venta: total,
          id_cliente: payload.clienteId,
          id_metodo_pago: payload.idMetodoPago,
        },
      });

      // Crear los detalles y ajustar el stock
      for (const { productoId, cantidad } of payload.items) {
        const prod = await tx.producto.update({
          where: { id_producto: productoId },
          data: { stock: { decrement: cantidad } },
        });

        await tx.ventaDetalle.create({
          data: {
            id_venta: venta.id_venta,
            id_producto: productoId,
            cantidad,
            precio: prod.precio_descuento,
          },
        });
      }

      // Crear registro de envío (sin código de seguimiento aún)
      const envio = await tx.envio.create({
        data: {
          fecha_envio: new Date(),
          estado_envio: "Pendiente",
          id_venta: venta.id_venta,
           // cod_seguimiento se ingresa más adelante
        },
      });

      // Devolver venta completa con detalles y envío
      return tx.venta.findUnique({
        where: { id_venta: venta.id_venta },
        include: {
          ventaDetalles: { include: { producto: true } },
          envio: true,
          metodoPago: true,
          usuario: true,
        },
      });
    });
  },

  async getAllVentas() {
    return await prisma.venta.findMany({
      include: {
        ventaDetalles: { include: { producto: true } },
        envio: true,
        metodoPago: true,
        usuario: true,
      },
    });
  },

  async getVentaById(id: number) {
    return await prisma.venta.findUnique({
      where: { id_venta: id },
      include: {
        ventaDetalles: { include: { producto: true } },
        envio: true,
        metodoPago: true,
        usuario: true,
      },
    });
  },

  // async actualizarEstadoEnvio(id: number, estado: string) {
  //   return await prisma.envio.update({
  //     where: { id_envio: id },
  //     data: { estado_envio: estado },
  //   });
  // },
};
