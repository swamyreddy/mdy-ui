import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
  private readonly baseUrl = environment.apiBaseUrl;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let apiReq = req;

    // ✅ Prefix base URL for relative APIs
    if (!req.url.startsWith('http')) {
      apiReq = req.clone({
        url: `${this.baseUrl}${req.url}`,
      });
    }
    console.log('Hello TOken BEFORE');
    // ✅ Only enable credentials in browser (important for SSR)
    // if (isPlatformBrowser(this.platformId)) {

    // }
    apiReq = apiReq.clone({
      withCredentials: true,
    });
    return next.handle(apiReq);
  }
}
