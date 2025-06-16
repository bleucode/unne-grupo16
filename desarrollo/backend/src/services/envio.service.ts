import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const envioService = {
  // Actualiza código de seguimiento y estado
  async updateEnvio(id_venta: number, data: { estado_envio?: string; cod_seguimiento?: string }) {
    const envio = await prisma.envio.update({
      where: { id_venta },
      data,
    });
    return envio;
  },

  // Consulta envío por código de seguimiento
  async getByTrackingCode(cod_seguimiento: string) {
    return prisma.envio.findFirst({
      where: { cod_seguimiento },
      include: {
        venta: {
          include: {
            ventaDetalles: { include: { producto: true } },
            usuario: true,
            metodoPago: true,
          },
        },
      },
    });
  },
};
