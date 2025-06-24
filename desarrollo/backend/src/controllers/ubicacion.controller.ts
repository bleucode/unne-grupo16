import { RequestHandler } from "express";
import { ubicacionService } from "../services/ubicacion.service";

export const ubicacionController = {
 
  listProvincias: (async (_req, res) => {
    try {
        const provincias = await ubicacionService.getAllProvincias();
        return res.json(provincias);
    }catch (error) {
        res.status(500).json({ message: 'Error al obtener provincias', error });
    }
  }) as RequestHandler,

  listLocalidades: (async (req, res) => {
    try {
        const provinciaId = Number(req.params.id);
        if (isNaN(provinciaId)) {
        return res.status(400).json({ error: "ID de provincia inválido" });
        }
        const localidades = await ubicacionService.getLocalidadesByProvincia(provinciaId);
        return res.json(localidades);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener localidades', error });
    }
    
  }) as RequestHandler
};
