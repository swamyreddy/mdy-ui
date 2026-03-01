import { Component, Input, OnInit, EventEmitter, Output } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { PropertyService } from 'src/app/shared/property.service';
import { Property } from '../../../shared/property.model';

@Component({
  selector: 'app-property-item',
  templateUrl: './property-item.component.html',
  styleUrls: ['./property-item.component.css']
})
export class PropertyItemComponent implements OnInit {
  @Input('property') item!: Property;
  // @Output() propertySelectedEvent = new EventEmitter<Property>();

  constructor(private propertyService: PropertyService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
  }
  onSelectProperty(id: String){
    // this.propertySelectedEvent.emit(this.item);
    // this.propertyService.propertySelected.emit(this.item);
    this.router.navigate(['/property', id])
  }
}
