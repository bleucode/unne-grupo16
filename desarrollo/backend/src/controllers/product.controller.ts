import { Request, Response, RequestHandler } from 'express';
import { productService } from '../services/product.service';
import { productValidator } from '../validators/product.validator';

export const productController = {
  getAll: (async (req: Request, res: Response) => {
    try {
      const products = await productService.getAll();
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener productos', error });
    }
  }) as RequestHandler,

  getAllActive: (async (req: Request, res: Response) => {
      try {
        const products = await productService.getAllActive();
        res.json(products);
      } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos activos', error });
      }
    }) as RequestHandler,

  getById: (async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);// Convertir ID a número
      if (isNaN(id)) {
         res.status(400).json({ error: 'ID inválido' });
         return;
      }
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
      // const {
      //   nombre,
      //   descripcion,
      //   especificacion,
      //   precio,
      //   stock,
      //   imagen,
      //   id_modelo,
      //   modelo,          // permitir modelo anidado
      //   id_categoria,
      //   categoria,       // permitir categoría anidada
      // } = req.body;

      // const newProduct = await productService.create({
      //   nombre,
      //   descripcion,
      //   especificacion,
      //   precio,
      //   stock,
      //   imagen,
      //   id_modelo,
      //   modelo,
      //   id_categoria,
      //   categoria,
      // });

      //valido
      const data = productValidator.create.parse(req.body);

      const newProduct = await productService.create(data);
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
        modelo,        // 
        id_categoria,
        categoria,     // 
      } = req.body;

      //valido que haya algun dato para actualizar y que sea valido 
      const data = productValidator.update.parse(req.body);

      const updatedProduct = await productService.update(id, data);
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

  getAllMarcas: (async (req: Request, res: Response) => {
    try {
      const brands = await productService.getMarcas();
      res.json(brands);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener marcas', error });
    }
  }) as RequestHandler,

  getAllModelos: (async (req: Request, res: Response) => {
    try {
      const models = await productService.getModelos();
      res.json(models);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener modelos', error });
    }
  }) as RequestHandler,

  getAllCategorias: (async (req: Request, res: Response) => {
    try {
      const categories = await productService.getCategorias();
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: 'Error al obtener categorías', error });
    }
  }) as RequestHandler,
};
