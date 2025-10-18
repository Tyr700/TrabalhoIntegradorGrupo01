import { randomUUID } from "node:crypto";
export class Car {
  constructor(
    private id: string,
    private model: string,
    private plate: string,
    private name: string,
    private contact: string,
    private createdAt: Date,
    private departureTime: Date | undefined,
    private price: Number
  ) {}

  static create(model: string, plate: string, name: string, contact: string) {
    const id = randomUUID();
    const createdAT = new Date();
    const price = 0;
    const departureTime = undefined;
    return new Car(
      id,
      model,
      plate,
      name,
      contact,
      createdAT,
      departureTime,
      price
    );
  }
  public getDepartureTime(): Date | undefined {
    return this.departureTime;
  }
  public setDepartureTime(departureTime: Date | undefined) {
    this.departureTime = departureTime;
  }

  public getId(): string {
    return this.id;
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

  public getName(): string {
    return this.name;
  }
  public getContact(): string {
    return this.contact;
  }
  public getPrice(): Number {
    return this.price;
  }
  public setPrice(price: Number) {
    this.price = price;
  }
}
