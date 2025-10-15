import express from "express";
import { CarController } from "./controller/CarController";

export const app = express();
const PORTA = 3000;

app.use(express.json());

CarController();

app.listen(PORTA, () => {
  console.log("Servidor rodando na porta " + PORTA);
});
