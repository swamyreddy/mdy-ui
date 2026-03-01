import { Component, Inject, OnInit } from '@angular/core';
import { AuthService } from './auth/auth.service';
import { Router } from '@angular/router';

import { BrowserService } from './core/services/browser.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'HPA Hyd';
  loadedPageType = 'buyer';

  constructor(
    private broswerService: BrowserService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {}

  onPageTypeSelected(pageType: string) {
    this.loadedPageType = pageType;
  }
  goToSearch(filters: {
    'property-type'?: string;
    'price-range'?: string;
    'search-query'?: string;
  }) {
    this.router.navigate(['/search'], { queryParams: filters });
  }
}
