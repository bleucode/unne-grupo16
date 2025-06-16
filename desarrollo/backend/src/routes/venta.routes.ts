import { Router } from "express";
import { ventaController } from "../controllers/venta.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

// Crear una venta (checkout) — solo usuarios autenticados
// Checkout – crear venta
router.post("/", authMiddleware.verifyToken, ventaController.create);

// Listar todas las ventas (ADMIN)
router.get("/", authMiddleware.verifyToken, ventaController.getAll);

// Ver venta por ID
router.get("/:id", authMiddleware.verifyToken, ventaController.getById);

// Actualizar estado/envío (ADMIN o rol de logística)
// router.put("/:id/envio", authMiddleware.verifyToken, ventaController.updateEnvio);

export default router;
