import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot,
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    return this.authService.user.pipe(
      take(1),
      map((user) => {
        const isAuth = !!user;
        console.log('AuthGuard: User authentication status:', isAuth);
        if (isAuth) {
          return true;
        }
        this.router.navigate(['/']);
        return false;
      }),
    );
  }
  // canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
  //   const isAuth = this.authService.user.subscribe((user) => {
  //     return !!user;
  //   });
  //   console.log('AuthGuard: User authentication status:', isAuth);
  //   if (isAuth) {
  //     return true;
  //   }
  //   this.authService.logout();
  //   return false;
  // }
}
