import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@NgModule({
  declarations: [ProfileComponent, ForgotPasswordComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class AuthModule {}
