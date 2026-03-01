import {
  Component,
  OnInit,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { PropertyType } from '../shared/propertyType.model';
import { PropertyService } from '../shared/property.service';
import { ModalService } from '../shared/modal.service';
import { AuthComponent } from '../auth/auth.component';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  collapsed = true;
  private userSub: Subscription;
  @Output() pageTypeSelected = new EventEmitter<string>();
  isAuthenticated: boolean = false;
  canBreadCrumbsVisible: boolean = true;
  propertyTypes: PropertyType[] = [
    { id: 0, short_name: 'project_type', name: 'Project Type' },
  ];
  priceRanges = [
    { label: 'Upto 25 Lakhs', short_name: '0-25L', value: '0-25L' },
    { label: '25 Lakhs - 50 Lakhs', short_name: '25L-50L', value: '25L-50L' },
    { label: '50 Lakhs - 1Cr', short_name: '50L-1Cr', value: '50L-1Cr' },
    { label: '1 Crore - 2 Crore', short_name: '1Cr-2Cr', value: '1Cr-2Cr' },
    { label: 'Above 2 Crore', short_name: '2Cr+', value: '2Cr+' }, // Use '0' as infinity/Max
  ];
  constructor(
    private authService: AuthService,
    private propertyService: PropertyService,
    private router: Router,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    this.canBreadCrumbsVisible = this.router.url !== '/home';
    this.userSub = this.authService.user.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
    this.getPropertyTypes();
  }

  logout() {
    this.authService.logout();
  }
  goToSearch(filters: {
    'property-type'?: string;
    'price-range'?: string;
    'search-query'?: string;
  }) {
    this.router.navigate(['/search'], { queryParams: filters });
  }
  getPropertyTypes() {
    this.propertyTypes = this.propertyService.getPropertyTypes();
    // this.propertyTypes.unshift({ id: 0, name: 'Project Type' });
  }
  onClickMenuItem(type: string) {
    this.pageTypeSelected.emit(type);
  }
  onSelectionChange(evt: any) {
    console.log(evt);
  }
  openLogin() {
    this.modalService.open(AuthComponent);
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
