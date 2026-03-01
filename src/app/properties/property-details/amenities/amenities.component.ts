import { Component, OnInit } from '@angular/core';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-amenities',
  templateUrl: './amenities.component.html',
  styleUrls: ['./amenities.component.css'],
})
export class AmenitiesComponent implements OnInit {
  amenities: any;

  constructor(private propertyService: PropertyService) {}

  ngOnInit(): void {
    this.propertyService.selectedProperty$.subscribe((prop) => {
      this.amenities = prop?.amenities;
    });
  }
}
