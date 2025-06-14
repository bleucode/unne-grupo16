import { Request, Response, RequestHandler } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getById(id);
      if (!product) {
        return res.status(404).json({ message: 'Producto no encontrado' });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el producto', error });
    }
  }) as RequestHandler,

  create: (async (req: Request, res: Response) => {
    try {
      const {
        nombre,
        descripcion,
        especificacion,
        precio,
        stock,
        imagen,
        id_modelo,
        modelo,          // permitir modelo anidado
        id_categoria,
        categoria,       // permitir categoría anidada
      } = req.body;

      const newProduct = await productService.create({
        nombre,
        descripcion,
        especificacion,
        precio,
        stock,
        imagen,
        id_modelo,
        modelo,
        id_categoria,
        categoria,
      });

      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el producto', error });
    }
  }) as RequestHandler,


  update: (async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const {
        nombre,
        descripcion,
        especificacion,
        precio,
        stock,
        imagen,
        estado,
        id_modelo,
        modelo,        // 🆕
        id_categoria,
        categoria,     // 🆕
      } = req.body;

      const updatedProduct = await productService.update(id, {
        nombre,
        descripcion,
        especificacion,
        precio,
        stock,
        imagen,
        estado,
        id_modelo,
        modelo,
        id_categoria,
        categoria,
      });

      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
  }) as RequestHandler,


  delete: (async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await productService.delete(id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
  }) as RequestHandler,
};
