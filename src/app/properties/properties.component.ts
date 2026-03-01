import { Component, OnInit } from '@angular/core';

import { PropertyService } from '../shared/property.service';
import { Property } from '../shared/property.model';

@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css'],
})
export class PropertiesComponent implements OnInit {
  selectedProperty!: Property;

  constructor(private propertyService: PropertyService) { }

  ngOnInit(): void {
    this.propertyService.propertySelected.subscribe((property: Property) =>{
      this.selectedProperty  = property;
    })
  }

}
