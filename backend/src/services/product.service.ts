import { PrismaClient } from '../../prisma/client';

const prisma = new PrismaClient();

export const productService = {
  async getAll() {
    return await prisma.producto.findMany();
  },

  async getById(id: number) {
    return await prisma.producto.findUnique({
      where: { id_producto: id },
    });
  },

  async create(data: any) {
    return await prisma.producto.create({
      data,
    });
  },

  async update(id: number, data: any) {
    return await prisma.producto.update({
      where: { id_producto: id },
      data,
    });
  },

  async delete(id: number) {
    return await prisma.producto.delete({
      where: { id_producto: id },
    });
  },
};
