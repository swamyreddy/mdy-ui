export class PropertyType {
  public id: number;
  public short_name: string;
  public name: string;

  constructor(id: number, short_name: string, name: string) {
    this.id = id;
    this.short_name = short_name;
    this.name = name;
  }
}
