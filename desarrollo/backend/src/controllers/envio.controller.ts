import { RequestHandler } from "express";
import { envioService } from "../services/envio.service";

export const envioController = {
  // agrego el codigo de seguimiento al envio 
  update: (async (req, res) => {
    try {
      const ventaId = Number(req.params.ventaId);
      const data = req.body; // { estado_envio, cod_seguimiento }
      const updated = await envioService.updateEnvio(ventaId, data);
      res.json(updated);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }) as RequestHandler,

  // busco el envio por su codigo
  track: (async (req, res) => {
    try {
      const codigo = req.params.codigo;
      const envio = await envioService.getByTrackingCode(codigo);
      if (!envio) return res.status(404).json({ error: "Envío no encontrado" });
      res.json(envio);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }) as RequestHandler,
};
