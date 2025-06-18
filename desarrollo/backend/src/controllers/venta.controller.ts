import { Request, Response, NextFunction } from 'express';
import { ventaService } from '../services/venta.service';
import { ventaValidator } from '../validators/venta.validator';
import Stripe from 'stripe';
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2022-11-15' });

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

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
  createStripePaymentIntent: async (req: Request, res: Response) => {
    try {
      const { amount, currency = 'usd', metadata } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
      metadata: {
        clienteId: '123',
        idMetodoPago: '1',
        direccionEnvioId: '55',
        cuotaId: '2',
        items: JSON.stringify([
          { productoId: 1, cantidad: 2 },
          { productoId: 3, cantidad: 1 }
        ]),
      },
    });
      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  },

  async stripeWebhook(req: Request, res: Response) {
    const sig = req.headers['stripe-signature'];
    
    try {
      const event = stripe.webhooks.constructEvent(req.body, sig!, endpointSecret); // req.body = raw


      if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;

        const extraData = {
          clienteId: Number(paymentIntent.metadata?.clienteId),
          idMetodoPago: Number(paymentIntent.metadata?.idMetodoPago),
          direccionEnvioId: Number(paymentIntent.metadata?.direccionEnvioId),
          cuotaId: paymentIntent.metadata?.cuotaId ? Number(paymentIntent.metadata.cuotaId) : undefined,
          items: JSON.parse(paymentIntent.metadata?.items || '[]'),
        };
        await ventaService.createVentaFromPaymentIntent(paymentIntent, extraData);
      }

      res.json({ received: true });
    } catch (err: any) {
      console.error(' Webhook error:', err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
    }
  },

  getOpcionesPago: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const opciones = await ventaService.getOpcionesPago();
      res.json(opciones);
    } catch (error) {
      next(error);
    }
  },

};

export const stripeWebhook = ventaController.stripeWebhook;
