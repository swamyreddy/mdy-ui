import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './auth/auth.guard';
import { PageNotFoundComponent } from './helpers/page-not-found/page-not-found.component';
import { HomeComponent } from './home/home.component';
import { PropertiesComponent } from './properties/properties.component';
import { AmenitiesComponent } from './properties/property-details/amenities/amenities.component';
import { FloorPlansPricingComponent } from './properties/property-details/floor-plans-pricing/floor-plans-pricing.component';
import { GalleryComponent } from './properties/property-details/gallery/gallery.component';
import { InformationComponent } from './properties/property-details/information/information.component';
import { PropertyDetailsComponent } from './properties/property-details/property-details.component';
import { CreatePropertyComponent } from './seller/create-property/create-property.component';
import { EditPropertyComponent } from './seller/edit-property/edit-property.component';
import { MyPropertiesComponent } from './seller/my-properties/my-properties.component';
import { SellerComponent } from './seller/seller.component';
import { SearchPropertiesComponent } from './search-properties/search-properties.component';
import { ProfileComponent } from './auth/profile/profile.component';
import { AboutComponent } from './pages/about/about.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';

const appRoutes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'search', component: SearchPropertiesComponent },
  { path: 'properties', component: PropertiesComponent },
  {
    path: 'property/:id',
    component: PropertyDetailsComponent,
    children: [
      { path: '', redirectTo: 'information', pathMatch: 'full' },
      { path: 'information', component: InformationComponent },
      { path: 'floor-plans-pricing', component: FloorPlansPricingComponent },
      { path: 'amenities', component: AmenitiesComponent },
      { path: 'gallery', component: GalleryComponent },
    ],
  },
  {
    path: 'seller',
    canActivate: [AuthGuard],
    component: SellerComponent,
    children: [
      { path: '', redirectTo: 'create-property', pathMatch: 'full' },
      { path: 'my-properties', component: MyPropertiesComponent },
      { path: 'create-property', component: CreatePropertyComponent },
      { path: 'edit-property/:id/edit', component: EditPropertyComponent },
    ],
  },
  { path: 'login', component: AuthComponent },
  { path: 'signup', component: AuthComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path: 'profile', canActivate: [AuthGuard], component: ProfileComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
