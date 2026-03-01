import { Component, OnInit, Input, OnDestroy, ViewChild } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { PropertyService } from 'src/app/shared/property.service';
import { Property } from '../../shared/property.model';
import { interval, Observable, Subscription, Observer } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { InterestedModalComponent } from 'src/app/shared/modals/interested-modal/interested-modal.component';

@Component({
  selector: 'app-property-details',
  templateUrl: './property-details.component.html',
  styleUrls: ['./property-details.component.css'],
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {
  @Input() property: Property;
  @ViewChild('myModal', { static: false }) modal: InterestedModalComponent;
  intervalSubscription: Subscription;
  propertyId: any;
  isInterested: boolean = false;
  constructor(
    private router: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.propertyService.sayInterestedEvent.subscribe((isInterested) => {
      this.isInterested = isInterested;
    });

    this.router.params.subscribe((params: Params) => {
      this.propertyId = params['id'];

      this.propertyService
        .getPropertyById(this.propertyId)
        .subscribe((property) => {
          this.property = property;
          this.propertyService.setProperty(property);
          console.log(this.property);
        });
    });
  }
  onInterestedButtonClick() {
    this.modal.openModal();
  }

  ngOnDestroy(): void {}
}
