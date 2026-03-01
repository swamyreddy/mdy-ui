import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { PropertyService } from '../shared/property.service';
import { SearchCriteria } from '../shared/search/search.component';
import { PropertyType } from '../shared/propertyType.model';

@Component({
  selector: 'app-search-properties',
  templateUrl: './search-properties.component.html',
  styleUrls: ['./search-properties.component.css'],
})
export class SearchPropertiesComponent implements OnInit {
  searchCriteria: SearchCriteria;
  totalProperties: number = 0;
  onSelectionChange(evt: any) {
    console.log(evt);
  }
  filters: any = {};
  propertyTypes: PropertyType[] = [];
  priceRanges: any[] = [];
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}
  ngOnInit() {
    this.getPropertyTypes();
    this.getPriceRanges();
    this.propertyService
      .getTotalCount()
      .subscribe((count) => (this.totalProperties = count));
    this.route.queryParams.subscribe((params) => {
      const propertyType = this.propertyTypes.find(
        (item) => item.short_name == params['property-type']
      );
      this.searchCriteria = {
        location: params['search-query'] || null,
        propertyType: propertyType?.id || null,
        priceRange: params['price-range'] || null,
      };
      this.propertyService.searchQuery(this.searchCriteria);
    });
  }
  getPropertyTypes() {
    this.propertyTypes = this.propertyService.getPropertyTypes();
    this.propertyTypes.unshift({ id: 0, short_name: '', name: 'All' });
  }

  getPriceRanges() {
    this.priceRanges = this.propertyService.getPriceRanges();
    this.priceRanges.unshift({ id: 0, short_name: '', label: 'All' });
  }
  // onFilterChange(key: string, value: any) {
  //   this.filters[key] = value || null;
  //   this.searchCriteria = {
  //     location: value || null,
  //     propertyType: value || null,
  //     priceRange: value || null,
  //   };
  //   this.propertyService.searchQuery(this.searchCriteria);
  //   console.log(this.filters, 'this.filters+++++++');
  //   //  this.propertyService.searchQuery(searchCriteria);
  // }
  onFilterChange(
    key: 'location' | 'propertyType' | 'priceRange' | 'bhk' | 'sort',
    value: any
  ) {
    this.filters[key] = value || null;

    this.searchCriteria = { ...this.filters };

    this.propertyService.searchQuery(this.searchCriteria);
  }
  applyFilters() {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: this.filters,
      queryParamsHandling: 'merge',
    });
  }

  resetFilters() {
    this.filters = {};
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
    });
  }
}
