import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { console } from 'inspector';

const prisma = new PrismaClient();

// En este servicio se manejan las operaciones relacionadas con los usuarios
// como la creación, actualización y eliminación de usuarios
// y la creación de direcciones y localidades

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
      return nuevaLocalidad;
    }

    return localidadExistente;
  },

  // Función para crear la dirección
  async createDireccion(direccionData: any) {
    const { calle, nro_calle, cod_postal, nombre_localidad } = direccionData;

    //const localidad = await this.createLocalidad(nombre_localidad);
    const localidad = await this.createLocalidad(nombre_localidad);
   // Verifica si la dirección ya existe
    const direccionExistente = await prisma.direccion.findFirst({
      where: {
        calle,
        nro_calle,
        cod_postal,
        id_localidad: localidad.id_localidad,
      },
    });
    
    if (direccionExistente) {
      return direccionExistente;
    }

    // Si no existe, la crea
    const newDireccion = await prisma.direccion.create({
      data: {
        calle,
        nro_calle,
        cod_postal,
        id_localidad: localidad.id_localidad,
      },
    });

    return newDireccion;
  },

  // Función para registrar al usuario
  // En nuestro diagrama de secuencia: Registrar_usuario()
  async registerUser(userData: any) {
   
    if (!userData.nombre || !userData.apellido || !userData.email || !userData.password||!userData.direccion||!userData.nro_celular||!userData.dni) {
      throw new Error("Faltan datos obligatorios del usuario");
    }


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
        password: userData.password,// Asignamos la contraseña hasheada
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
    console.log("Datos del usuario a actualizar:", userData);
  
    // Verificar si el rol "administrador" existe
    const adminRole = await prisma.rol.findUnique({
      where: { id_rol: 2 },
    });
  
    if (!adminRole) {
      await prisma.rol.create({
        data: {
          id_rol: 2,
          nombre_rol: 'administrador',
        },
      });
      console.log('Rol de administrador creado');
    }
  
    // Si hay nueva contraseña, la encriptamos
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }
  
    // Primero actualizamos la dirección si viene en userData
    if (userData.direccion && userData.direccion.id_direccion) {
      await prisma.direccion.update({
        where: { id_direccion: userData.direccion.id_direccion },
        data: {
          calle: userData.direccion.calle,
          nro_calle: userData.direccion.nro_calle,
          cod_postal: userData.direccion.cod_postal,
          id_localidad: userData.direccion.id_localidad,
        },
      });
    }
  

    const updatedUser = await prisma.usuario.update({
      where: { id_usuario: id },
      data: {
        nombre: userData.nombre,
        apellido: userData.apellido,
        dni: userData.dni,
        email: userData.email,
        nro_celular: userData.nro_celular,
        password: userData.password, // opcional
        rol: {
          connect: { id_rol: userData.id_rol },
        },
        
      },
    });
  
    return updatedUser;
  },
  // En nuestro diagrama de secuencia: eliminar_usuario()
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
