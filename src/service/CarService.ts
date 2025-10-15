import { Car } from "../model/Car";

export class CarService {
  private listaC: Car[] = [];
  private HistC: Car[] = [];

  constructor() {}

  public CreateCar(car: {
    model: string;
    plate: string;
    name: string;
    contact: string;
  }): Car {
    const c = Car.create(car.model, car.plate, car.name, car.contact);
    this.listaC.push(c);
    return c;
  }

  public getCar() {
    return this.listaC;
  }
  public getHist() {
    return this.HistC;
  }

  public Calculate(createdAT: Date, departureTime: Date) {
    const diffMs = departureTime.getTime() - createdAT.getTime();
    if (diffMs <= 0) {
      throw new Error("A data de saída deve ser posterior à data de entrada.");
    }
    const horas = diffMs / (1000 * 60 * 60);
    const horasCobradas = Math.ceil(horas);
    if (horasCobradas <= 1) {
      return 10; // valor mínimo
    }
    const valorTotal = 10 + (horasCobradas - 1) * 2;
    return valorTotal;
  }

  public RemoveCar(plate: string) {
    const fomatedPlate = plate.toUpperCase();
    const index = this.listaC.findIndex(
      (car) => car.getPlate() === fomatedPlate
    );

    if (index === -1) {
      console.log(`Carro com placa ${fomatedPlate} não encontrado.`);
      return undefined;
    }

    const car = this.listaC[index];
    const departureTime = new Date();

    car.setPrice(this.Calculate(car.getcreatedAt(), departureTime));
    const value = car.getPrice();

    // Remover do array
    this.HistC.push(car);
    this.listaC.splice(index, 1);
    return value;
  }
}
