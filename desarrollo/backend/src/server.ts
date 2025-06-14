import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import { router } from './routes';  // tu router principal

dotenv.config();
const app = express();

app.use(cors({
  origin: 'http://localhost:3001',
  methods: ['GET','POST','PUT','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json());

// Este monta todas las rutas definidas en routes/index.ts bajo '/api'
app.use('/api', router);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
