export class UnitType {
  public id: string;
  public short_name: string;
  public name: string;

  constructor(id: string, short_name: string, name: string) {
    this.id = id;
    this.short_name = short_name;
    this.name = name;
  }
}
