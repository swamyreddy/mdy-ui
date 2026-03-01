import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { AuthService } from 'src/app/auth/auth.service';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { GlobalModalComponent } from 'src/app/shared/modals/gobal-modal/gobal-modal.component';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-my-properties',
  templateUrl: './my-properties.component.html',
  styleUrls: ['./my-properties.component.css'],
})
export class MyPropertiesComponent implements OnInit {
  properties: Property[] = [];
  @ViewChild('myModal', { static: false }) modal: GlobalModalComponent;
  @Output() propertyWasSelectedEvent = new EventEmitter<Property>();
  propertyId: any;
  property: Property;
  user: any;

  constructor(
    private propertyService: PropertyService,
    private alertService: AlertService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.authService.user.subscribe((user) => {
      this.user = user;
    });
    this.propertyService.propertiesChanged.subscribe((property: any) => {
      console.log(property);
      const index = this.properties.findIndex((item) => item.id == property.id);
      if (index !== -1) {
        this.properties.splice(index, 1, property);
      } else {
        this.properties.push(property);
      }
    });
    this.propertyService
      .getPropertiesByUser({ userId: this.user.id })
      .subscribe((result) => {
        this.properties = result;
        console.log(result);
      });
  }
  onPropertySelected(item: Property) {
    this.propertyWasSelectedEvent;
  }
  deleteProperty(property: Property) {
    this.propertyId = property.id;
    this.property = property;
    this.modal.openModal();
  }
  //Delete Single Property by Id
  // deleteProperty(id: String) {
  //   this.propertyService.deleteProperty(id).subscribe((result: any) => {
  //     const index = this.properties.findIndex((item) => item.id === id);
  //     this.properties.splice(index, 1);
  //     this.alertService.success('Property deleted successfully!');
  //   });
  // }

  onDeleteProperty(propertyId: number) {
    // Filter out the deleted property
    this.properties = this.properties.filter(
      (p) => parseInt(p.id) !== propertyId,
    );
    console.log(`Deleted property with id: ${propertyId}`);
  }
}
