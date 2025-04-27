import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const userRepository = {
  createUser: (data: any) => prisma.usuario.create({ data }),
  getAllUsers: () => prisma.usuario.findMany(),
  getUserById: (id: number) => prisma.usuario.findUnique({ where: { id_usuario: id } }),
  getUserByEmail: (email: string) => prisma.usuario.findUnique({ where: { email } }),
  updateUser: (id: number, data: any) => prisma.usuario.update({ where: { id_usuario: id }, data }),
  deleteUser: (id: number) => prisma.usuario.delete({ where: { id_usuario: id } }),
};
