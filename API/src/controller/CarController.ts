import { CarService } from "../service/CarService";
import { Car } from "../model/Car";
import { app } from "../server";
import { ArduinoService } from "../service/ArduinoService";

export function CarController() {
  const carService = new CarService();
  let arduinoService: ArduinoService | null = null;

  app.post("/cadastro", (req, res) => {
    try {
      const { model, plate, name, contact } = req.body;

      // Validação dos campos obrigatórios
      if (!model || !plate || !name || !contact) {
        return res.status(400).json({
          error:
            "Todos os campos são obrigatórios: model, plate, name, contact",
        });
      }

      const carData = { model, plate, name, contact };
      const newCar = carService.CreateCar(carData);
      res.status(201).json({
        message: "Carro cadastrado com sucesso",
        car: newCar,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  app.get("/verCarroHistorico", (req, res) => {
    try {
      const Cars = carService.getHist();
      res.status(200).json(Cars);
    } catch (error: any) {
      res.status(400);
    }
  });

  app.delete("/remover", (req, res) => {
    try {
      // Opção 1: Usar placa do corpo da requisição
      const { plate } = req.body;

      if (!plate) {
        return res.status(400).json({ error: "Placa é obrigatória" });
      }

      const value = carService.RemoveCar(plate);

      if (value === undefined) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      res.status(200).json({
        message: "Carro removido com sucesso",
        value: value,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Opção 2: Rota alternativa usando parâmetro de rota (mais RESTful)
  app.delete("/remover/:plate", (req, res) => {
    try {
      const { plate } = req.params;

      const value = carService.RemoveCar(plate);

      if (value === undefined) {
        return res.status(404).json({ error: "Carro não encontrado" });
      }

      res.status(200).json({
        message: "Carro removido com sucesso",
        value: value,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Rotas do Arduino
  app.post("/arduino/conectar", async (req, res) => {
    try {
      const { porta } = req.body;
      arduinoService = new ArduinoService(carService, porta || "COM3");
      await arduinoService.initialize();
      res.status(200).json({
        message: "Arduino conectado com sucesso",
        porta: porta || "COM3",
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/arduino/abrir-cancela", async (req, res) => {
    try {
      if (!arduinoService) {
        return res.status(400).json({ error: "Arduino não conectado" });
      }
      await arduinoService.getArduino().openBarrier();
      res.status(200).json({ message: "Cancela aberta" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/arduino/fechar-cancela", async (req, res) => {
    try {
      if (!arduinoService) {
        return res.status(400).json({ error: "Arduino não conectado" });
      }
      await arduinoService.getArduino().closeBarrier();
      res.status(200).json({ message: "Cancela fechada" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  app.post("/arduino/desconectar", (req, res) => {
    try {
      if (!arduinoService) {
        return res.status(400).json({ error: "Arduino não conectado" });
      }
      arduinoService.disconnect();
      arduinoService = null;
      res.status(200).json({ message: "Arduino desconectado" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });
}
