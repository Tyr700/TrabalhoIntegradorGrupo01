import { randomUUID } from "node:crypto";
export class Car {
  constructor(
    private id: string,
    private model: string,
    private plate: string,
    private name: string,
    private contact: string,
    private createdAt: Date,
    private price: Number
  ) {}

  static create(model: string, plate: string, name: string, contact: string) {
    const id = randomUUID();
    const createdAT = new Date();
    const price = 0;
    return new Car(id, model, plate, name, contact, createdAT, price);
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
