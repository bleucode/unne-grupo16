import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();


export const userService = {
  // Función para crear o buscar localidad por nombre
  async createLocalidad(nombreLocalidad: string) {
    const localidadExistente = await prisma.localidad.findFirst({
      where: { nombre: nombreLocalidad },
    });

    if (!localidadExistente) {
      let provincia = await prisma.provincia.findFirst({
        where: { nombre: "Corrientes" },
      });

      if (!provincia) {
        provincia = await prisma.provincia.create({
          data: { nombre: "Corrientes" },
        });
      }

      const nuevaLocalidad = await prisma.localidad.create({
        data: {
          nombre: nombreLocalidad,
          id_provincia: provincia.id_provincia,
        },
      });

      console.log('Localidad creada:', nuevaLocalidad);
      return nuevaLocalidad;
    }

    return localidadExistente;
  },

  // Función para crear la dirección
  async createDireccion(direccionData: any) {
    const { calle, nro_calle, cod_postal, nombre_localidad } = direccionData;

    const localidad = await this.createLocalidad(nombre_localidad);

    const newDireccion = await prisma.direccion.create({
      data: {
        calle,
        nro_calle,
        cod_postal,
        id_localidad: localidad.id_localidad,
      },
    });

    console.log('Dirección creada:', newDireccion);

    if (!newDireccion.id_direccion) {
      throw new Error('La dirección no se creó correctamente');
    }

    return newDireccion;
  },

  // Función para registrar al usuario
  async registerUser(userData: any) {
    console.log("Datos del usuario:", userData);
    console.log("Password antes de hashear:", userData.password);  // Verifica la contraseña antes de hashearla
    if (!userData.direccion) {
      throw new Error('Datos de dirección faltantes');
    }

    const hashedPassword = userData.password;
    console.log("Contraseña hasheada:", hashedPassword);  // Verifica el hash generado


    const direccion = await this.createDireccion(userData.direccion);

    // Aseguramos que el rol por defecto exista
    let rol = await prisma.rol.findFirst({
      where: { nombre_rol: "usuario" }, // Asegúrate de que el nombre del rol sea "usuario"
    });

    if (!rol) {
      // Si el rol no existe, lo creamos
      rol = await prisma.rol.create({
        data: { nombre_rol: "usuario" },
      });
    }

    const newUser = await prisma.usuario.create({
      data: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        dni: userData.dni,
        email: userData.email,
        nro_celular: userData.nro_celular,
        id_rol: rol.id_rol,  // Usamos el rol por defecto
        password: hashedPassword,
        fecha_registro: new Date(),  // Asignamos la fecha actual si no se proporciona
        estado: userData.estado !== undefined ? userData.estado : true,  // Si no se proporciona, se asigna 'true' por defecto
        id_direccion: direccion.id_direccion,
      },
    });

    return newUser;
  },

  // Funciones adicionales para obtener y actualizar usuarios
  async getAllUsers() {
    return await prisma.usuario.findMany({where: { estado: true }});
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
  },

  async getAddressById(id: number) {
    return await prisma.direccion.findUnique({
      where: { id_direccion: id },
    });
  },
};
