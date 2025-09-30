import { Car } from "../model/Car";

export class CarService {
  private listaC: Car[] = [];

  constructor(public dataU: Car[]) {
    this.listaC = dataU;
  }

  public CreateCar(car: {
    model: string;
    plate: string;
    arrivalTime: Date;
    departureTime: Date;
    name: string;
    contact: string;
  }): Car {
    const c = new Car(
      car.model,
      car.plate,
      car.arrivalTime,
      car.departureTime,
      car.name,
      car.contact
    );
    this.listaC.push(c);
    return c;
  }
  public getCar() {
    return this.listaC;
  }
}
