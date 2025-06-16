import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export const ubicacionService = {
  /** Devuelve todas las provincias ordenadas alfabéticamente */
  async getAllProvincias() {
    return prisma.provincia.findMany({
      orderBy: { nombre: "asc" }
    });
  },

  /** Devuelve las localidades de una provincia concreta */
  async getLocalidadesByProvincia(provinciaId: number) {
    return prisma.localidad.findMany({
      where: { id_provincia: provinciaId },
      orderBy: { nombre: "asc" }
    });
  }
};
