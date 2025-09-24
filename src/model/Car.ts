export class Car {
  constructor(
    private model: string,
    private plate: string,
    private arrivalTime: Date,
    private departureTime: Date,
    private name: string,
    private contact: string
  ) {}

  public getModel(): string {
    return this.model;
  }
  public getPlate(): string {
    return this.plate;
  }
  public getArrivalTime(): Date {
    return this.arrivalTime;
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
