import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productService = {
  async getAll() {
    return await prisma.producto.findMany({
      include: {
        categoria: true,
        marca: true,
        modelo: true,
      },
    });
  },

  async getAllActive() {
      return await prisma.producto.findMany({
        where: { activo: true },
        include: {
          categoria: true,
          marca: true,
          modelo: true,
        },
      });
    },

  async getById(id: number) {
    return await prisma.producto.findUnique({
      where: { id_producto: id },
      include: {
        categoria: true,
        marca: true,
        modelo: true,
      },
    });
  },

  // create: (data: {
  //   nombre: string;
  //   descripcion: string;
  //   especificacion: string;
  //   precio: number;
  //   stock: number;
  //   imagen: string;
  //   modelo?: {
  //     descripcion: string;
  //     marca: {
  //       descripcion: string;
  //     };
  //   };
  //   categoria?: {
  //     nombre: string;
  //   };
  //   id_modelo?: number; // opcional si usa connect
  //   id_categoria?: number; // opcional si usa connect
  // }) => {
  //   const productoData: any = {
  //     nombre: data.nombre,
  //     descripcion: data.descripcion,
  //     especificacion: data.especificacion,
  //     precio: data.precio,
  //     stock: data.stock,
  //     imagen: data.imagen,
  //     estado: true,
  //   };

  //   // Crear modelo + marca si se envía objeto
  //   if (data.modelo) {
  //     productoData.modelo = {
  //       create: {
  //         descripcion: data.modelo.descripcion,
  //         marca: {
  //           create: {
  //             descripcion: data.modelo.marca.descripcion,
  //           },
  //         },
  //       },
  //     };
  //   } else if (data.id_modelo) {
  //     productoData.modelo = {
  //       connect: { id_modelo: data.id_modelo },
  //     };
  //   }

  //   // Crear categoría si se envía objeto
  //   if (data.categoria) {
  //     productoData.categoria = {
  //       create: {
  //         nombre: data.categoria.nombre,
  //       },
  //     };
  //   } else if (data.id_categoria) {
  //     productoData.categoria = {
  //       connect: { id_categoria: data.id_categoria },
  //     };
  //   }

  //   return prisma.producto.create({
  //     data: productoData,
  //     include: {
  //       modelo: {
  //         include: {
  //           marca: true,
  //         },
  //       },
  //       categoria: true,
  //     },
  //   });
  // },
 async create(data: {
    nombre: string;
    descripcion: string;
    especificacion: string;
    precio: number;
    precio_descuento: number;
    stock: number;
    imagen: string;
    id_modelo: number;
    id_categoria: number;
    id_marca: number;
  }) {
    return prisma.producto.create({
      data: {
        nombre: data.nombre,
        descripcion: data.descripcion,
        especificacion: data.especificacion,
        precio: data.precio,
        precio_descuento: data.precio_descuento,
        stock: data.stock,
        imagen: data.imagen,
        activo: true,
        modelo: { connect: { id_modelo: data.id_modelo } },
        categoria: { connect: { id_categoria: data.id_categoria } },
        marca: { connect: { id_marca: data.id_marca } },
      },
      include: {
        modelo: true,
        categoria: true,
        marca: true,
      },
    });
  },
  // update: (
  //     id: number,
  //     data: {
  //       nombre?: string;
  //       descripcion?: string;
  //       especificacion?: string;
  //       precio?: number;
  //       stock?: number;
  //       imagen?: string;
  //       estado?: boolean;
  //       modelo?: {
  //         descripcion?: string;
  //         marca?: {
  //           descripcion?: string;
  //         };
  //       };
  //       id_modelo?: number; // opcional si se quiere conectar
  //       categoria?: {
  //         nombre?: string;
  //       };
  //       id_categoria?: number;
  //     }
  //   ) => {
  //     const updateData: any = {
  //       ...data,
  //     };

  //     // Si llega modelo
  //     if (data.modelo) {
  //       if (data.modelo.descripcion || data.modelo.marca) {
  //         updateData.modelo = {
  //           update: {
  //             ...(data.modelo.descripcion && { descripcion: data.modelo.descripcion }),
  //             ...(data.modelo.marca && {
  //               marca: {
  //                 update: {
  //                   ...(data.modelo.marca.descripcion && { descripcion: data.modelo.marca.descripcion }),
  //                 },
  //               },
  //             }),
  //           },
  //         };
  //       }
  //     } else if (data.id_modelo) {
  //       updateData.modelo = {
  //         connect: {
  //           id_modelo: data.id_modelo,
  //         },
  //       };
  //     }

  //     // Si llega categoría
  //     if (data.categoria) {
  //       updateData.categoria = {
  //         create: {
  //           nombre: data.categoria.nombre,
  //         },
  //       };
  //     } else if (data.id_categoria) {
  //       updateData.categoria = {
  //         connect: {
  //           id_categoria: data.id_categoria,
  //         },
  //       };
  //     }

  //     // Eliminamos claves innecesarias que Prisma no acepta directamente
  //     delete updateData.id_modelo;
  //     delete updateData.id_categoria;

  //     return prisma.producto.update({
  //       where: { id_producto: id },
  //       data: updateData,
  //       include: {
  //         modelo: {
  //           include: {
  //             marca: true,
  //           },
  //         },
  //         categoria: true,
  //       },
  //     });
  //   },
// Actualizar un producto usando IDs para relaciones
  async update(
    id: number,
    data: Partial<{
      nombre: string;
      descripcion: string;
      especificacion: string;
      precio: number;
      precio_descuento: number;
      stock: number;
      imagen: string;
      activo: boolean;
      id_modelo: number;
      id_categoria: number;
      id_marca: number;
    }>
  ) {
    // Construir el objeto de actualización
    const updateData: any = {
      ...data,
    };

    // Conectar modelo si se recibe ID
    if (data.id_modelo !== undefined) {
      updateData.modelo = { connect: { id_modelo: data.id_modelo } };
    }
    // Conectar categoría si se recibe ID
    if (data.id_categoria !== undefined) {
      updateData.categoria = { connect: { id_categoria: data.id_categoria } };
    }
    // Conectar marca si se recibe ID
    if (data.id_marca !== undefined) {
      updateData.marca = { connect: { id_marca: data.id_marca } };
    }

    // Eliminar claves para no romper Prisma
    delete updateData.id_modelo;
    delete updateData.id_categoria;
    delete updateData.id_marca;

    return prisma.producto.update({
      where: { id_producto: id },
      data: updateData,
      include: { modelo: true, categoria: true, marca: true },
    });
  },

  delete: (id: number) => {
    return prisma.producto.update({
      where: { id_producto: id },
      data: { activo: false }, // baja lógica
    });
  },
};
