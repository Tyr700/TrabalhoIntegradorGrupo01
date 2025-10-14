import { CarService } from "../service/CarService";
import { Car } from "../model/Car";
import { app } from "../server";

export function CarController() {
  const data: Car[] = [];
  const dataHistory: Car[] = [];
  const carService = new CarService(data, dataHistory);

  app.post("/cadastro", (req, res) => {
    try {
      const carData = req.body;
      const newCar = carService.CreateCar(carData);
      res.status(201).json(newCar);
    } catch (error: any) {
      res.status(400);
    }
  });

  app.get("/verCarro", (req, res) => {
    try {
      const Cars = carService.getCar();
      res.status(200).json(Cars);
    } catch (error: any) {
      res.status(400);
    }
  });
}
