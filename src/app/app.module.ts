import { APP_INITIALIZER, LOCALE_ID, NgModule } from '@angular/core';
import '@angular/common/locales/global/en-IN';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PropertiesComponent } from './properties/properties.component';
import { PropertyListComponent } from './properties/property-list/property-list.component';
import { PropertyDetailsComponent } from './properties/property-details/property-details.component';
import { PropertyItemComponent } from './properties/property-list/property-item/property-item.component';
import { SellerComponent } from './seller/seller.component';
import { CreatePropertyComponent } from './seller/create-property/create-property.component';
import { EditPropertyComponent } from './seller/edit-property/edit-property.component';
import { HeaderComponent } from './header/header.component';
import { LayoutModule } from '@angular/cdk/layout';
import { DropdownDirective } from './shared/dropdown.directive';
import { MyPropertiesComponent } from './seller/my-properties/my-properties.component';
import { PropertyService } from './shared/property.service';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { FloorPlansPricingComponent } from './properties/property-details/floor-plans-pricing/floor-plans-pricing.component';
import { AmenitiesComponent } from './properties/property-details/amenities/amenities.component';
import { InformationComponent } from './properties/property-details/information/information.component';
import { GalleryComponent } from './properties/property-details/gallery/gallery.component';
import { PageNotFoundComponent } from './helpers/page-not-found/page-not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { AlertModule } from './shared/alert/alert.module';
import { AuthComponent } from './auth/auth.component';
import { LoadingComponent } from './shared/loading/loading.component';
import { AuthInterceptorService } from './auth/auth.interceptor.service';
import { LeadsComponent } from './leads/leads.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SearchPropertiesComponent } from './search-properties/search-properties.component';
import { AuthModule } from './auth/auth.module';
import { authInitializer } from './auth/auth.init';
import { AuthService } from './auth/auth.service';
import { SellerModule } from './seller/seller.module';
import { ManageUnitsComponent } from './seller/manage-units/manage-units.component';
import { AboutComponent } from './pages/about/about.component';
import { BrowserService } from './core/services/browser.service';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    PropertiesComponent,
    PropertyListComponent,
    PropertyDetailsComponent,
    PropertyItemComponent,
    SellerComponent,
    CreatePropertyComponent,
    EditPropertyComponent,
    HeaderComponent,
    DropdownDirective,
    MyPropertiesComponent,
    FloorPlansPricingComponent,
    AmenitiesComponent,
    InformationComponent,
    GalleryComponent,
    PageNotFoundComponent,
    AuthComponent,
    LoadingComponent,
    LeadsComponent,
    SearchPropertiesComponent,
    ManageUnitsComponent,
    AboutComponent,
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    LayoutModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    FontAwesomeModule,
    AuthModule,
    SellerModule,
  ],
  providers: [
    PropertyService,
    BrowserService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    {
      provide: APP_INITIALIZER,
      useFactory: authInitializer,
      deps: [AuthService],
      multi: true,
    },
    { provide: LOCALE_ID, useValue: 'en-IN' },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
