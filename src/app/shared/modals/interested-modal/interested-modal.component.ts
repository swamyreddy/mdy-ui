import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { PropertyService } from '../../property.service';
import { ApiResponse } from '../../models/api-response.model';

@Component({
  selector: 'app-interested-modal',
  templateUrl: './interested-modal.component.html',
  styleUrls: ['./interested-modal.component.css'],
})
export class InterestedModalComponent implements OnInit {
  @Input() propertyId: number;
  isVisible = false;
  form: FormGroup;
  contactVisible: boolean = false;
  contactInfo: any;
  constructor(private propertyService: PropertyService) {}
  @ViewChild('modalRef') modalRef!: ElementRef;
  ngOnInit(): void {
    this.form = new FormGroup({
      reason: new FormControl('Investment', Validators.required),
      dealer: new FormControl('No', Validators.required),
      name: new FormControl('', Validators.required),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern(/^[6-9]\d{9}$/),
      ]),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  openModal(): void {
    setTimeout(() => {
      this.isVisible = true;
    }, 10);
  }

  closeModal(): void {
    setTimeout(() => {
      this.isVisible = false;
    }, 300);
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.propertyService
      .saveLead({ ...this.form.value, propertyId: this.propertyId })
      .subscribe((res: any) => {
        this.contactInfo = res.data;
        this.contactVisible = true;
      });
  }
}
