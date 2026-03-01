import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AlertModule } from './alert/alert.module';
import { LoadingComponent } from './loading/loading.component';
import { SearchComponent } from './search/search.component';
import { InterestedModalComponent } from './modals/interested-modal/interested-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GlobalModalComponent } from './modals/gobal-modal/gobal-modal.component';

@NgModule({
  declarations: [
    SearchComponent,
    InterestedModalComponent,
    GlobalModalComponent,
  ],
  imports: [CommonModule, AlertModule, ReactiveFormsModule],
  exports: [
    AlertModule,
    FormsModule,
    SearchComponent,
    InterestedModalComponent,
    GlobalModalComponent,
  ],
})
export class SharedModule {}
