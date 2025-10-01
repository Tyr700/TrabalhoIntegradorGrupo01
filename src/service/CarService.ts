import { Car } from "../model/Car";

export class CarService {
  private listaC: Car[] = [];

  constructor(public dataU: Car[]) {
    this.listaC = dataU;
  }

  public CreateCar(car: {
    model: string;
    plate: string;
    departureTime: Date;
    name: string;
    contact: string;
  }): Car {
    const c = Car.create(
      car.model,
      car.plate,
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
