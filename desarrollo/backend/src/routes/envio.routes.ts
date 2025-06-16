import { Router } from "express";
import { envioController } from "../controllers/envio.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { roleMiddleware } from "../middlewares/role.middleware";

const router = Router();

// Actualización por Admin/Vendedor
router.put(
  "/:ventaId",
  authMiddleware.verifyToken,
  roleMiddleware.authorizeRoles("1", "3"),
  envioController.update
);

// Consulta pública por código
router.get("/track/:codigo", envioController.track);

export default router;
