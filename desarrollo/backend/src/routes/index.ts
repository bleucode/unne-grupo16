import { Router } from 'express';
import { userRouter } from './user.routes';
import { authRouter } from './auth.routes';
//import { homeRouter } from './home.routes';
import { productRouter } from './product.routes';
import ventaRoutes from "./venta.routes";
import envioRoutes from "./envio.routes";
import ubicacionRoutes from "./ubicacion.routes";

import dotenv from 'dotenv';
dotenv.config();

export const router = Router();

//router.use('/', homeRouter);
router.use('/user', userRouter);
router.use('/auth', authRouter);
router.use('/products', productRouter);
router.use("/ventas", ventaRoutes);
router.use("/envios", envioRoutes);
router.use("/ubicacion",ubicacionRoutes);