export class Car {
  constructor(
    private id: string,
    private model: string,
    private plate: string,
    private departureTime: Date,
    private name: string,
    private contact: string,
    private createdAt: Date
  ) {}

  static create(
    model: string,
    plate: string,
    departureTime: Date,
    name: string,
    contact: string
  ) {
    const id = crypto.randomUUID();
    const createdAT = new Date();
    return new Car(id, model, plate, departureTime, name, contact, createdAT);
  }

  public getModel(): string {
    return this.model;
  }
  public getPlate(): string {
    return this.plate;
  }
  public getcreatedAt(): Date {
    return this.createdAt;
  }
  public getDepartureTime(): Date {
    return this.departureTime;
  }

  public getName(): string {
    return this.name;
  }
  public getContact(): string {
    return this.contact;
  }
}
