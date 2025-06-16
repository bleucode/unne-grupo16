import { Request, Response, NextFunction } from 'express';
import { ventaService } from '../services/venta.service';
import { ventaValidator } from '../validators/venta.validator';

export const ventaController = {
  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // validar
      const data = ventaValidator.parse(req.body);

      // lógica
      const ventaCreada = await ventaService.createVenta({
        clienteId: data.clienteId,
        idMetodoPago: data.idMetodoPago,
        direccionEnvioId: data.direccionEnvioId,
        items: data.items.map(i => ({
          productoId: i.productoId,
          cantidad: i.cantidad,
        })),
      });

      res.status(201).json(ventaCreada);
    } catch (err: any) {
      //next(err); // lo pasamos al middleware de errores, o:
      res.status(400).json({ error: err.message });
    }
  },

  getAll: async (req: Request, res: Response): Promise<void> => {
    const ventas = await ventaService.getAllVentas();
    res.json(ventas);
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const id = Number(req.params.id);
      if (isNaN(id)) {
        res.status(400).json({ error: 'ID inválido' });
        return;
      }
      const venta = await ventaService.getVentaById(id);
      if (!venta) {
        res.status(404).json({ error: 'Venta no encontrada' });
        return;
      }
      res.json(venta);
    } catch (err) {
      next(err);
    }
  },
};
