import { Property } from 'src/app/shared/property.model';

export class PropertyResponseInterface {
  public currentPage: number;
  public data: Property[];
  public status: string;
  public results: number;
  public totalPages: number;

  constructor(
    currentPage: number,
    data: Property[],
    results: number,
    totalPages: number,
    status: string,
  ) {
    this.currentPage = currentPage;
    this.data = data;
    this.results = results;
    this.totalPages = totalPages;
    this.status = status;
  }
}
