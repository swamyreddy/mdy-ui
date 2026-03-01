import { Amenitiy } from './amenities.model';
export interface PropertyPhoto {
  id: number;
  iamgeUrl: string;
}
export class Property {
  public isMultipleProperties: boolean;
  public id: string;
  public title: string;
  public category: string;
  public price: string;
  public location: string;
  public defaultPic: string;
  public defaultPicUrl?: string;
  public userId: string;
  public propertyType: string;
  public unitType: string;
  public bathRooms: string;
  public amenities: Amenitiy[];
  public photos: PropertyPhoto[];
  public builtupArea: string;
  public carpetArea: string;
  public units: any[];
  public description: string;
  public totalFloors: number;
  public propertyAge: number;
  public facing: number;
  public projectAreaValue: number;
  public projectAreaUnit: 'ACRES' | 'GUNTAS' | 'SQ_YARDS';

  public projectAreaInSqYards: number; // norma

  constructor(
    isMultipleProperties: boolean,
    id: string,
    title: string,
    category: string,
    price: string,
    location: string,
    defaultPic: string,
    defaultPicUrl: string,
    userId: string,
    propertyType: string,
    unitType: string,
    bathRooms: string,
    photos: PropertyPhoto[],
    amenities: Amenitiy[],
    builtupArea: string,
    carpetArea: string,
    units: any[],
    description: string,
    totalFloors: number,
    propertyAge: number,
    facing: number,
    projectAreaValue: number,
    projectAreaUnit: 'ACRES' | 'GUNTAS' | 'SQ_YARDS',
    projectAreaInSqYards: number,
  ) {
    this.id = id;
    this.isMultipleProperties;
    this.title = title;
    this.category = category;
    this.price = price;
    this.location = location;
    this.defaultPic = defaultPic;
    this.defaultPicUrl = defaultPicUrl;
    this.userId = userId;
    this.propertyType = propertyType;
    this.unitType = unitType;
    this.bathRooms = bathRooms;
    this.photos = photos;
    this.amenities = amenities;
    this.builtupArea = builtupArea;
    this.carpetArea = carpetArea;
    this.units = units;
    this.description = description;
    this.propertyAge = propertyAge;
    this.totalFloors = totalFloors;
    this.facing = facing;
    this.projectAreaValue = projectAreaValue;
    this.projectAreaUnit = projectAreaUnit;
    this.projectAreaInSqYards = projectAreaInSqYards;
  }
}
