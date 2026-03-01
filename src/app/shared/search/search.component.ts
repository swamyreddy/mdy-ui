import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { PropertyService } from '../property.service';
import {
  fromEvent,
  Observable,
  of,
  Subject,
  Subscriber,
  Subscription,
} from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PropertyType } from '../propertyType.model';
import { debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';

export interface SearchCriteria {
  location: string;
  propertyType: number | null;
  priceRange: number | null;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit, AfterViewInit {
  searchSubscription!: Subscription;
  @Output() searchSubmitted = new EventEmitter<SearchCriteria>();
  options: string[];
  @Input() placeholder: string;
  @Input() onlyInputSearch: string;
  @Output() selectionChange = new EventEmitter<string>();
  searchForm: FormGroup;
  showLocationsList: boolean = true;
  locations = ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
  propertyTypes: PropertyType[] = [
    { id: 0, short_name: 'project_type', name: 'Project Type' },
  ];
  priceRanges = [
    { label: 'Price Range', value: '' },
    { label: 'Upto 25 Lakhs', value: '0-25L' },
    { label: '25 Lakhs - 50 Lakhs', value: '25L-50L' },
    { label: '50 Lakhs - 1Cr', value: '50L-1Cr' },
    { label: '1 Crore - 2 Crore', value: '1Cr-2Cr' },
    { label: 'Above 2 Crore', value: '2Cr+' }, // Use '0' as infinity/Max
  ];
  filteredLocations: string[] = [];
  @ViewChild('searchInput') searchInput!: ElementRef;
  selectedPropertyType: any;
  constructor(
    private propertyService: PropertyService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
  ) {}
  ngOnInit() {
    this.searchForm = this.fb.group({
      location: null,
      propertyType: this.propertyTypes[0]?.id,
      priceRange: this.priceRanges[0]?.value,
    });
    this.getPropertyTypes();
  }
  ngAfterViewInit() {
    const searchChanges$ = fromEvent(
      this.searchInput.nativeElement,
      'keyup',
    ).pipe(
      map((event: any) => event.target.value),
      debounceTime(400),
      distinctUntilChanged(),
      tap((value) => console.log(value, 'Searched this value')),
    );
    this.searchSubscription = searchChanges$.subscribe((value) => {
      console.log('perofrmed value: ' + value);
    });
  }

  getPropertyTypes() {
    this.propertyTypes = this.propertyService.getPropertyTypes();
    this.propertyTypes.unshift({ id: 0, name: 'All', short_name: 'all' });
  }
  onPropertyTypeChange(val: string) {
    this.selectedPropertyType = val.toLowerCase().replace(/\s+/g, '');
  }
  onInputChange(event: any) {
    const query = event.target.value.trim().toLowerCase();
    if (query === '') {
      this.filteredLocations = [];
      this.showLocationsList = false;
      return;
    }
    this.filteredLocations = this.locations.filter((loc) =>
      loc.toLowerCase().includes(query),
    );
    this.showLocationsList = this.filteredLocations.length > 0;
  }

  onSelectLocation(location: string) {
    this.searchForm.get('location')?.setValue(location);
    this.onSearchSubmit();
    this.filteredLocations = [];
  }
  onSearchSubmit() {
    const searchCriteria: SearchCriteria = {
      location: this.searchForm.get('location')?.value,
      propertyType: this.searchForm.get('propertyType')?.value,
      priceRange: this.searchForm.get('priceRange')?.value,
    };
    this.propertyService.searchQuery(searchCriteria);
  }
  getSelectedPropertyTypeName(propertyTypeId: number): string {
    const selectedType = this.propertyTypes.find(
      (type) => type.id === propertyTypeId,
    );
    return selectedType ? selectedType.name : '';
  }
}
