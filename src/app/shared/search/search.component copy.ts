import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { PropertyService } from '../property.service';
import { Observable, Subscriber } from 'rxjs';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, map, startWith } from 'rxjs/operators';
export interface SearchCriteria {
  city: string;
  propertyType: string;
  minPrice: number | null;
  maxPrice: number | null;
}
@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  @Output() searchSubmitted = new EventEmitter<SearchCriteria>();
  options: string[];
  @Input() placeholder: string;
  @Output() selectionChange = new EventEmitter<string>();
  filteredLocations$!: Observable<string[]>;
  searche = {
    city: '' as string,
    propertyType: '' as string,
    budget: '' as string,
  };
  priceRanges = [
    { label: 'Select Price Range', value: '' },
    { label: 'Upto 25 Lakhs', value: '0-25' },
    { label: '25 Lakhs - 50 Lakhs', value: '25-50' },
    { label: '50 Lakhs - 75 Lakhs', value: '50-75' },
    { label: '75 Lakhs - 1 Crore', value: '75-100' },
    { label: 'Above 1 Crore', value: '100-0' }, // Use '0' as infinity/Max
  ];
  budgets = ['< 50L', '50L - 1Cr', '1Cr - 2Cr', '2Cr+'];
  searchValueQuery: string;
  showLocationDropdown: boolean = true;
  selectedOption: string;
  showOptions: boolean;
  subscriber: any = new Subscriber();
  searchForm: FormGroup;

  // Static data for dropdowns (in a real app, this would come from a service/API)
  cities = ['New Delhi', 'Mumbai', 'Bangalore', 'Hyderabad'];
  propertyTypes = ['All Types', 'Apartment', 'Villa', 'Plot'];
  constructor(
    private propertyService: PropertyService,
    private fb: FormBuilder
  ) {
    this.showOptions = false;
  }

  ngOnInit() {
    this.options = ['Hyderabad', 'Chennai', 'Bengalore'];

    this.searchForm = this.fb.group({
      city: null, // Default to 'All Cities'
      propertyType: [this.propertyTypes[0]], // Default to 'All Types'
      priceRange: [this.priceRanges[0].value],
    });
    this.filteredLocations$ = this.searchForm.get('city')!.valueChanges.pipe(
      startWith(''),
      debounceTime(300), // Wait 300ms after user stops typing
      // Map the current value to a list of filtered locations
      map((value) => this._filter(value || ''))
    );
  }
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    // Set showSuggestions to true if the input is not empty and the array is non-empty
    const results = this.cities.filter((location) =>
      location.toLowerCase().includes(filterValue)
    );

    // Only show suggestions if there's text AND there are results
    this.showLocationDropdown = filterValue.length > 0 && results.length > 0;
    return results;
  }
  search(evt: any) {
    this.searchValueQuery = evt.target.value;
  }

  performSearch() {
    // this.propertyService
    //   .getProperties({ filter: { searchQuery: evt.target.value } })
    //   .subscribe((res) => {
    //     this.subscriber.next()
    //   });
    this.propertyService.searchQuery(this.searchValueQuery);
    // Call your search API with the searchQuery parameter
    // e.g. this.http.get('/api/search?q=' + this.searchQuery).subscribe(...);
  }
  onSubmitSearch(): void {
    if (this.searchForm.valid) {
      // Clean up the data before emitting
      const criteria: SearchCriteria = {
        city:
          this.searchForm.value.city === 'All Cities'
            ? ''
            : this.searchForm.value.city,
        propertyType:
          this.searchForm.value.propertyType === 'All Types'
            ? ''
            : this.searchForm.value.propertyType,
        minPrice: this.searchForm.value.minPrice,
        maxPrice: this.searchForm.value.maxPrice,
      };

      // Emit the criteria to the parent component for API call/filtering
      this.searchSubmitted.emit(criteria);

      console.log('Search Criteria:', criteria);
      // You would call a PropertyService here in a production app.
    }
  }
  // Function to handle clicking a suggestion
  selectLocation(location: string): void {
    this.searchForm.get('city')?.setValue(location);
    this.showLocationDropdown = false;
    // Optional: hide the suggestion list after selection
  }
  // NEW: Function to handle input focus (opens list if needed)
  onInputFocus(): void {
    // Re-run the filter logic when the user clicks back into the box
    const currentValue = this.searchForm.get('location')?.value || '';
    this._filter(currentValue);
  }

  // NEW: Function to handle input blur (hides list after a delay)
  // We use a delay (setTimeout) to allow the click event on the suggestion item to fire first
  onInputBlur(): void {
    setTimeout(() => {
      this.showLocationDropdown = false;
    }, 200);
  }
}
