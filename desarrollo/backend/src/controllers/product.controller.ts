import { Request, Response, RequestHandler } from 'express';
import { productService } from '../services/product.service';

export const productController = {
  getAll: (async (req, res) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }) as RequestHandler,   

  getById: (async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const product = await productService.getById(id);
      if (!product) 
        return res.status(404).json({ message: 'Producto no encontrado' });
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener el producto', error });
    }
  }) as RequestHandler,

  create: (async (req, res) => {
    try {
      const newProduct = await productService.create(req.body);
      res.status(201).json(newProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error al crear el producto', error });
    }
  }) as RequestHandler,

  update: (async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const updatedProduct = await productService.update(id, req.body);
      res.json(updatedProduct);
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar el producto', error });
    }
  }) as RequestHandler,

  delete: (async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await productService.delete(id);
      res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
      res.status(500).json({ message: 'Error al eliminar el producto', error });
    }
  }) as RequestHandler,
};
