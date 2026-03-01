import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BrowserService {
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  get isBrowserEnvironment(): boolean {
    return this.isBrowser;
  }

  get window(): Window | null {
    return this.isBrowser ? window : null;
  }

  get document(): Document | null {
    return this.isBrowser ? document : null;
  }
}
