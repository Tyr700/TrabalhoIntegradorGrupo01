import express from "express";
import { CarController } from "./controller/CarController";

export const app = express();
const PORTA = 3000;

app.listen(PORTA, () => {
  console.log("ta rodabdo");
});
