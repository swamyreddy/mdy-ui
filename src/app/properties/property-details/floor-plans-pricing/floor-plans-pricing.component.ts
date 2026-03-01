import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-floor-plans-pricing',
  templateUrl: './floor-plans-pricing.component.html',
  styleUrls: ['./floor-plans-pricing.component.css'],
})
export class FloorPlansPricingComponent implements OnInit {
  property?: Property;
  propertyId: number;
  isGatedCommunity: boolean = false; // single and project level differentiation
  activeIndex = 0;
  units: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService,
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params: Params) => {
      this.propertyId = +params['id'];
      this.propertyService
        .getPropertyById(this.propertyId)
        .subscribe((property) => {
          this.property = property;
          this.units = property?.units || [];
          if (this.property.isMultipleProperties) this.isGatedCommunity = true;
        });
    });
  }

  selectTab(index: number) {
    this.activeIndex = index;
  }
}
