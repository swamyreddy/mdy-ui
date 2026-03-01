import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { PropertyType } from 'src/app/properties/models/property-type.model';
import { UnitType } from 'src/app/properties/models/unit-type.model';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { Amenitiy } from 'src/app/shared/amenities.model';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-edit-property',
  templateUrl: './edit-property.component.html',
  styleUrls: ['./edit-property.component.css'],
})
export class EditPropertyComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {}
}
