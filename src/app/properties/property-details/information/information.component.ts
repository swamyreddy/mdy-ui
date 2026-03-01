import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.css'],
})
export class InformationComponent implements OnInit {
  propertyId: any;
  property?: Property;

  constructor(
    private route: ActivatedRoute,
    private propertyService: PropertyService
  ) {}

  ngOnInit(): void {
    this.route.parent?.params.subscribe((params: Params) => {
      this.propertyId = +params['id'];
      this.propertyService.getPropertyById(this.propertyId).subscribe(property => {
        this.property = property
      });
    });
  }

  sayInterested(){
    this.propertyService.sayInterestedEvent.next(true);
    setTimeout(() => {
      this.propertyService.sayInterestedEvent.next(false);
    }, 1000)
    setTimeout(() => {
      this.propertyService.sayInterestedEvent.next(true);
    }, 2000)
  }
}
