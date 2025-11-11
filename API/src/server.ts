import express from "express";
import cors from 'cors';
import { CarController } from "./controller/CarController";

export const app = express();
app.use(cors({
  origin: 'https://grupo01projeto.escolatecnicaadelia.info/api',
  credentials: true
}));
const PORTA = 3001;

app.use(express.json());

CarController();

app.listen(PORTA, () => {
  console.log("Servidor rodando na porta " + PORTA);
});
