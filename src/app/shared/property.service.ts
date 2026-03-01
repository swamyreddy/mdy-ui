import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Property } from '../shared/property.model';
import { BehaviorSubject, from, Observable, Subject } from 'rxjs';
import { filter, map, mergeMap, tap } from 'rxjs/operators';
import { Amenitiy } from './amenities.model';
import { PropertyType } from './propertyType.model';
import { UnitType } from '../properties/models/unit-type.model';
import { Lead } from '../leads/models/lead.model';
import { PropertyResponseInterface } from '../properties/models/property-response.model';
import { environment } from 'src/environments/environment';

export interface propertyResponseData {
  status: any;
  data: Property;
}

@Injectable({
  providedIn: 'root',
})
export class PropertyService {
  propertySelected = new EventEmitter<Property>();
  propertiesChanged = new Subject<Property[]>();
  private selectedProperty = new BehaviorSubject<Property | null>(null);
  selectedProperty$ = this.selectedProperty.asObservable();

  sayInterestedEvent = new Subject<boolean>();
  private amenities: Amenitiy[] = [];

  private propertyTypes: PropertyType[] = [
    new PropertyType(2, 'apartment', 'Apartment'),
    new PropertyType(3, 'villa', 'Villa'),
    new PropertyType(4, 'independent-house', 'Independent House'),
    new PropertyType(7, 'commercial', 'Commercial'),
    new PropertyType(1, 'studio', 'Studio'),
    new PropertyType(5, 'plot', 'Plot'),
    new PropertyType(6, 'form-land', 'Form Land'),
  ];

  private unitTypes: UnitType[] = [
    new UnitType('1', '1bhk', '1BHK'),
    new UnitType('1.5', '1.5bhk', '1.5BHk'),
    new UnitType('2', '2bhk', '2BHK'),
    new UnitType('2.5', '2.5bhk', '2.5BHK'),
    new UnitType('3', '3bhk', '3BHK'),
    new UnitType('3.5', '3.5bhk', '3.5BHK'),
    new UnitType('4', '4bhk+', '4BHK+'),
  ];

  private priceRanges = [
    { label: 'Upto 25 Lakhs', value: '0-25L' },
    { label: '25 Lakhs - 50 Lakhs', value: '25L-50L' },
    { label: '50 Lakhs - 1Cr', value: '50L-1Cr' },
    { label: '1 Crore - 2 Crore', value: '1Cr-2Cr' },
    { label: 'Above 2 Crore', value: '2Cr+' }, // Use '0' as infinity/Max
  ];
  private facingOptions = [
    'North',
    'South',
    'East',
    'West',
    'North-East',
    'North-West',
    'South-East',
    'South-West',
  ];

  private properties: Property[] = [];
  searchQuerySubject: Subject<string> = new Subject<string>();
  searchQuery$ = this.searchQuerySubject.asObservable();
  private totalCount$ = new BehaviorSubject<number>(0);
  baseUrl: string = environment.apiBaseUrl;
  constructor(private http: HttpClient) {}
  getProperties(req?: any) {
    return this.http.post<Property[]>(this.baseUrl + '/properties', req).pipe(
      tap((res) => this.totalCount$.next(res.length)),
      map((properties) => {
        return properties;
      }),
    );
  }
  getFacings() {
    return this.facingOptions;
  }
  getTotalCount() {
    return this.totalCount$.asObservable();
  }
  setProperty(property: Property) {
    this.selectedProperty.next(property);
  }
  getPropertiesByUser(data: any) {
    return this.http.post<Property[]>(
      this.baseUrl + '/properties/get-properties-by-user',
      data,
    );
    map((properties) => {
      return properties;
    });
  }

  getAmenities() {
    return this.http.get<Amenitiy[]>(this.baseUrl + '/properties/amenities');
  }

  getPropertyTypes() {
    return this.propertyTypes.slice();
  }
  getPriceRanges() {
    return this.priceRanges.slice();
  }

  getUnitTypes() {
    return this.unitTypes.slice();
  }

  getPropertyById(id: number) {
    //  console.log(this.properties)
    // const source = from([this.properties]);
    // console.log(source)
    // // return source.pipe(filter((data) => data.id == index))
    // let foundProperty = this.properties.find((item) => item.id == this.properties[index].id);
    // return foundProperty;

    return this.http
      .get<propertyResponseData>(
        this.baseUrl + '/properties/get-property-by-id/' + id,
      )
      .pipe(map((property) => property.data));
  }

  updateProperty(item: any) {
    this.propertiesChanged.next(item);
  }

  editProperty(property: FormData) {
    return this.http.post(this.baseUrl + '/properties/edit-property', property);
  }

  deleteProperty(id: String) {
    return this.http.delete(this.baseUrl + '/properties/delete-property/' + id);
  }

  addProperty(property: FormData) {
    return this.http.post(this.baseUrl + '/properties/add-property', property);

    // this.properties.push(property);
    //   const promise = new Promise((resolve, reject) => {
    //     resolve(this.properties)
    //   })

    //   this.propertiesChanged.next(this.properties.slice())
    //   return promise;
  }

  deletePropertyImage(id: number) {
    return this.http.delete(
      this.baseUrl + '/properties/delete-property-photo/' + id,
    );
  }
  deletePropertyUnit(id: number) {
    return this.http.delete(
      this.baseUrl + '/properties/delete-property-unit/' + id,
    );
  }
  searchQuery(query: any) {
    this.searchQuerySubject.next(query);
  }

  saveLead(formValues: Lead) {
    return this.http.post(this.baseUrl + '/user/save-lead', formValues);
  }
}
