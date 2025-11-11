import { Car } from "../model/Car";

interface ParkingSpot {
  id: number;
  occupied: boolean;
  carId?: string;
}

export class CarService {
  private listaC: Car[] = [];
  private HistC: Car[] = [];
  private spots: ParkingSpot[] = [
    { id: 1, occupied: false },
    { id: 2, occupied: false },
    { id: 3, occupied: false }
  ];

  constructor() {}

  public CreateCar(car: {
    model: string;
    plate: string;
    name: string;
    contact: string;
  }): Car {
    if (this.listaC.length >= 3) {
      throw new Error("Ja tem 3 carros no estacionamento");
    }
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

  public Calculate(createdAT: Date, departureTime: Date | undefined) {
    if (!departureTime) {
      throw new Error("Data de saída é obrigatória.");
    }
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
    car.setDepartureTime(new Date());

    car.setPrice(this.Calculate(car.getcreatedAt(), car.getDepartureTime()));
    const value = car.getPrice();

    const spot = this.spots.find(s => s.carId === car.getId());
    if (spot) {
      spot.occupied = false;
      spot.carId = undefined;
    }

    this.HistC.push(car);
    this.listaC.splice(index, 1);
    return value;
  }

  public updateSpotStatus(spotId: number, occupied: boolean, carId?: string) {
    const spot = this.spots.find(s => s.id === spotId);
    if (spot) {
      spot.occupied = occupied;
      spot.carId = carId;
    }
  }

  public getSpots() {
    return this.spots;
  }

  public assignCarToSpot(carId: string): number | null {
    const freeSpot = this.spots.find(s => !s.occupied);
    if (freeSpot) {
      freeSpot.occupied = true;
      freeSpot.carId = carId;
      return freeSpot.id;
    }
    return null;
  }
}
