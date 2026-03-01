import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertComponent } from './alert.component';
import { AlertService } from './alert.service';



@NgModule({
  declarations: [
    AlertComponent
  ],
  providers: [
    AlertService
  ],
  imports: [
    CommonModule
  ],
  exports: [
    AlertComponent
  ]
})
export class AlertModule { }
