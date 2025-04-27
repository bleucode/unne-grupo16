import { userRepository } from '../repositories/user.repository';
import bcrypt from 'bcryptjs';

export const userService = {
  registerUser: async (userData: any) => {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = await userRepository.createUser({ ...userData, password: hashedPassword });
    return newUser;
  },

  getAllUsers: () => userRepository.getAllUsers(),

  getUserById: (id: number) => userRepository.getUserById(id),

  updateUser: async (id: number, userData: any) => {
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
    return userRepository.updateUser(id, userData);
  },

  deleteUser: (id: number) => userRepository.deleteUser(id),
};
