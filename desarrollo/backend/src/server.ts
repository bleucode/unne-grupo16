import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { stripeWebhook } from './controllers/venta.controller'; // ajustá ruta si es distinta
import { router } from './routes';  
import bodyParser from 'body-parser';

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3000',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));


app.post(
  '/api/ventas/stripe/webhook',
  bodyParser.raw({ type: 'application/json' }), // necesario para verificar firma
  stripeWebhook 
);

app.use(express.json());

// Este monta todas las rutas definidas en routes/index.ts bajo '/api'
app.use('/api', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
