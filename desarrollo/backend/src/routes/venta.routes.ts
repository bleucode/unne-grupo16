import { Router } from "express";
import { ventaController } from "../controllers/venta.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post('/stripe/webhook', ventaController.stripeWebhook);
router.get('/opcionesPago', ventaController.getOpcionesPago);
// Crear una venta (checkout) — solo usuarios autenticados
// Checkout – crear venta
router.post("/", authMiddleware.verifyToken, ventaController.create);

// Listar todas las ventas (ADMIN)
router.get("/", authMiddleware.verifyToken, ventaController.getAll);

// Ver venta por ID
router.get("/:id", authMiddleware.verifyToken, ventaController.getById);

// Actualizar estado/envío (ADMIN o rol de logística)
// router.put("/:id/envio", authMiddleware.verifyToken, ventaController.updateEnvio);
// Nuevo endpoint para crear Payment Intent
router.post('/stripe/create-payment-intent', ventaController.createStripePaymentIntent);

export default router;
