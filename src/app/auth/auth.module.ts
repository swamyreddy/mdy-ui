import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile/profile.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ReactiveFormsModule],
})
export class AuthModule {}
