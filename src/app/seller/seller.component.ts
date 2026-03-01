import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { PropertyService } from '../shared/property.service';

@Component({
  selector: 'app-seller',
  templateUrl: './seller.component.html',
  styleUrls: ['./seller.component.css'],
})
export class SellerComponent implements OnInit {
  editMode: boolean = false;
  constructor(private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    // editMode = this.activatedRoute.snapshot.params
    this.activatedRoute.params.subscribe((params: Params) => {
      // this.propertyId = params['id'];
      // this.property = this.propertyService.getPropertyById(this.propertyId);
      console.log(params);
    });
  }
}
