import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const productService = {
  getAll: () => {
    return prisma.producto.findMany({
      include: {
        modelo: true,
        categoria: true,
      },
    });
  },

  getById: (id: number) => {
    return prisma.producto.findUnique({
      where: { id_producto: id },
      include: {
        modelo: true,
        categoria: true,
      },
    });
  },
  create: (data: {
    nombre: string;
    descripcion: string;
    especificacion: string;
    precio: number;
    stock: number;
    imagen: string;
    modelo?: {
      descripcion: string;
      marca: {
        descripcion: string;
      };
    };
    categoria?: {
      nombre: string;
    };
    id_modelo?: number; // opcional si usa connect
    id_categoria?: number; // opcional si usa connect
  }) => {
    const productoData: any = {
      nombre: data.nombre,
      descripcion: data.descripcion,
      especificacion: data.especificacion,
      precio: data.precio,
      stock: data.stock,
      imagen: data.imagen,
      estado: true,
    };

    // Crear modelo + marca si se envía objeto
    if (data.modelo) {
      productoData.modelo = {
        create: {
          descripcion: data.modelo.descripcion,
          marca: {
            create: {
              descripcion: data.modelo.marca.descripcion,
            },
          },
        },
      };
    } else if (data.id_modelo) {
      productoData.modelo = {
        connect: { id_modelo: data.id_modelo },
      };
    }

    // Crear categoría si se envía objeto
    if (data.categoria) {
      productoData.categoria = {
        create: {
          nombre: data.categoria.nombre,
        },
      };
    } else if (data.id_categoria) {
      productoData.categoria = {
        connect: { id_categoria: data.id_categoria },
      };
    }

    return prisma.producto.create({
      data: productoData,
      include: {
        modelo: {
          include: {
            marca: true,
          },
        },
        categoria: true,
      },
    });
  },

  update: (
      id: number,
      data: {
        nombre?: string;
        descripcion?: string;
        especificacion?: string;
        precio?: number;
        stock?: number;
        imagen?: string;
        estado?: boolean;
        modelo?: {
          descripcion?: string;
          marca?: {
            descripcion?: string;
          };
        };
        id_modelo?: number; // opcional si se quiere conectar
        categoria?: {
          nombre?: string;
        };
        id_categoria?: number;
      }
    ) => {
      const updateData: any = {
        ...data,
      };

      // Si llega modelo
      if (data.modelo) {
        if (data.modelo.descripcion || data.modelo.marca) {
          updateData.modelo = {
            update: {
              ...(data.modelo.descripcion && { descripcion: data.modelo.descripcion }),
              ...(data.modelo.marca && {
                marca: {
                  update: {
                    ...(data.modelo.marca.descripcion && { descripcion: data.modelo.marca.descripcion }),
                  },
                },
              }),
            },
          };
        }
      } else if (data.id_modelo) {
        updateData.modelo = {
          connect: {
            id_modelo: data.id_modelo,
          },
        };
      }

      // Si llega categoría
      if (data.categoria) {
        updateData.categoria = {
          create: {
            nombre: data.categoria.nombre,
          },
        };
      } else if (data.id_categoria) {
        updateData.categoria = {
          connect: {
            id_categoria: data.id_categoria,
          },
        };
      }

      // Eliminamos claves innecesarias que Prisma no acepta directamente
      delete updateData.id_modelo;
      delete updateData.id_categoria;

      return prisma.producto.update({
        where: { id_producto: id },
        data: updateData,
        include: {
          modelo: {
            include: {
              marca: true,
            },
          },
          categoria: true,
        },
      });
    },

  delete: (id: number) => {
    return prisma.producto.update({
      where: { id_producto: id },
      data: { estado: false }, // baja lógica
    });
  },
};
