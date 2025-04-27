import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const userService = {
  async registerUser(userData: any) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await prisma.usuario.create({
      data: { ...userData, password: hashedPassword },
    });
    return newUser;
  },

  async getAllUsers() {
    return await prisma.usuario.findMany();
  },

  async getUserById(id: number) {
    return await prisma.usuario.findUnique({
      where: { id_usuario: id },
    });
  },

  async getUserByEmail(email: string) {
    return await prisma.usuario.findUnique({
      where: { email },
    });
  },

  async updateUser(id: number, userData: any) {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: userData,
    });
  },

  // async deleteUser(id: number) {
  //   return await prisma.usuario.delete({
  //     where: { id_usuario: id },
  //   });
  // },
  async deleteUser(id: number) {
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: { estado: false },
    });
  },
  async activateUser(id: number) {
    return await prisma.usuario.update({
      where: { id_usuario: id },
      data: { estado: true }, 
    });
  }
  
  
};

// import { userRepository } from '../repositories/user.repository';
// import bcrypt from 'bcryptjs';

// export const userService = {
//   registerUser: async (userData: any) => {
//     const hashedPassword = await bcrypt.hash(userData.password, 10);
//     const newUser = await userRepository.createUser({ ...userData, password: hashedPassword });
//     return newUser;
//   },

//   getAllUsers: () => userRepository.getAllUsers(),

//   getUserById: (id: number) => userRepository.getUserById(id),

//   updateUser: async (id: number, userData: any) => {
//     if (userData.password) {
//       userData.password = await bcrypt.hash(userData.password, 10);
//     }
//     return userRepository.updateUser(id, userData);
//   },

//   deleteUser: (id: number) => userRepository.deleteUser(id),
// };
