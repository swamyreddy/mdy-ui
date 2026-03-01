import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { PropertyService } from 'src/app/shared/property.service';
import { Property } from '../../shared/property.model';
import { Subscription } from 'rxjs';
import { query } from '@angular/animations';

@Component({
  selector: 'app-property-list',
  templateUrl: './property-list.component.html',
  styleUrls: ['./property-list.component.css'],
})
export class PropertyListComponent implements OnInit {
  // @Output() propertyWasSelectedEvent = new EventEmitter<Property>()
  properties?: any = [];
  isLoading = true;
  private searchSubscription: Subscription;

  constructor(private propertyService: PropertyService) {
    this.searchSubscription = this.propertyService.searchQuery$.subscribe(
      (query) => {
        this.getProperties({ filter: { searchQuery: query } });
      },
    );
  }

  ngOnInit(): void {
    this.getProperties();
  }

  getProperties(data?: any) {
    this.isLoading = true;
    this.propertyService.getProperties(data).subscribe((result) => {
      this.properties = result || [];
      this.isLoading = false;
      console.log(result);
    });
  }
  // onPropertySelected(item: Property){
  //   this.propertyWasSelectedEvent.emit(item);
  // }
}
