import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { AuthService } from '../auth.service';
import { isPlatformBrowser } from '@angular/common';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { FormControl, FormGroup, Form, Validators } from '@angular/forms';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;

  constructor(
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private alertService: AlertService,
  ) {}

  ngOnInit(): void {
    this.profileForm = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      phone: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{10}$'),
      ]),
    });
    this.bindProfileData();
  }

  bindProfileData() {
    const userDetails = this.authService.getUserDetails();

    this.profileForm.setValue({
      name: userDetails.name,
      email: userDetails.email,
      phone: userDetails.phone,
    });
    this.profileForm.disable();
  }

  onSubmit() {
    // Logic to handle form submission
    const updatedDetails = {
      name: this.profileForm.value.name,
      email: this.profileForm.value.email,
      phone: this.profileForm.value.phone,
    };
    // Update user details in localStorage or send to backend
    if (isPlatformBrowser(this.platformId)) {
      const existingUserDetails = this.authService.getUserDetails();
      const updatedUserDetails = { ...existingUserDetails, ...updatedDetails };
      localStorage.setItem('userDetails', JSON.stringify(updatedUserDetails));
      this.authService
        .updateUserDetails(updatedUserDetails)
        .subscribe((data) => {
          this.alertService.success('Profile updated successfully!');
        });
    }
  }
  editProfile() {
    this.profileForm.enable();
  }
}
