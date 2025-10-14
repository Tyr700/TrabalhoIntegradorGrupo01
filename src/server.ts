import express from "express";
import { CarController } from "./controller/CarController";

export const app = express();
const PORTA = 3000;

// Middleware para parsing de JSON
app.use(express.json());

// Inicializar as rotas
CarController();

app.listen(PORTA, () => {
  console.log("Servidor rodando na porta " + PORTA);
});
