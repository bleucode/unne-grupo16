import { Router } from "express";
import { ubicacionController } from "../controllers/ubicacion.controller";

const router = Router();

// Listar todas las provincias
router.get("/provincias", ubicacionController.listProvincias);

// Listar localidades de una provincia concreta
router.get("/provincias/:id/localidades", ubicacionController.listLocalidades);

export default router;
