import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Property } from 'src/app/shared/property.model';
import { PropertyService } from 'src/app/shared/property.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css'],
})
export class GalleryComponent implements OnInit {
  property: Property | null = null;
  propertyPhotos: any;
  images = [
    {
      src: 'http://localhost:3000/images/1683027062767-231533064-small-bedroom-design.jpg',
      alt: 'Image 1',
    },
    {
      src: 'http://localhost:3000/images/1685073617485-5916581-copper-wash-basin-cabinet-design-for-dining-room.jpg',
      alt: 'Image 2',
    },
  ];
  constructor(private propertyService: PropertyService) {}
  ngOnInit() {
    this.propertyService.selectedProperty$.subscribe((prop) => {
      this.propertyPhotos = prop?.photos;
    });
  }
  selectedIndex = 0;

  selectImage(index: number) {
    this.selectedIndex = index;
  }

  nextImage() {
    this.selectedIndex = (this.selectedIndex + 1) % this.images.length;
  }

  prevImage() {
    this.selectedIndex =
      (this.selectedIndex - 1 + this.images.length) % this.images.length;
  }
}
