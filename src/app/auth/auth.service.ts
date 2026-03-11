import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { User } from './user.model';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { environment } from 'src/environments/environment';

export interface authResponseData {
  name: string;
  email: string;
  phone: string;
  token: string;
  expiresIn: string;
  id: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  user = new BehaviorSubject<User>(null as any);
  baseUrl: string = environment.apiBaseUrl;
  constructor(
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {}
  isLoggedIn() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('userDetails');
      const currentUser = userJson !== null ? JSON.parse(userJson) : {};
      if (!currentUser) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  }

  signup(data: any) {
    return this.http
      .post<authResponseData>(this.baseUrl + '/auth/register', data)
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(res);
        }),
      );
  }

  sendOTP(phone: { phone: string }) {
    return this.http
      .post(this.baseUrl + '/auth/send-otp', phone)
      .pipe(catchError(this.handleError));
  }
  verifyOTP(data: { phone: string; otp: string }) {
    return this.http
      .post(this.baseUrl + '/auth/verifty-otp', data)
      .pipe(catchError(this.handleError));
  }
  sendResetPwdOtp(phone: string) {
    return this.http.post('/auth/send-reset-pwd-otp', { phone });
  }

  verifyResetPwdOtp(phone: string, otp: string) {
    return this.http.post('/auth/verify-reset-pwd-otp', { phone, otp });
  }

  resetPassword(phone: string, password: string) {
    return this.http.post('/auth/reset-password', { phone, password });
  }
  signin(data: any) {
    return this.http
      .post<authResponseData>(this.baseUrl + '/auth/login', data)
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(res);
        }),
      );
  }
  private handleError(errRes: HttpErrorResponse) {
    let errMessage = 'Unknown error occured';
    if (!errRes.error || !errRes.error.error) {
      return throwError(errMessage);
    }
    switch (errRes.error.error.type) {
      case 'EMAIL_DOES_NOT_EXISTS':
        errMessage = errRes.error.error.msg;
        break;
      case 'INVALID_DETAILS':
        errMessage = errRes.error.error.msg;
        break;
    }
    return throwError(errMessage);
  }

  logout() {
    this.user.next(null as any);
    this.router.navigate(['/']);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('userDetails');
    }
  }

  autoLogin() {
    console.log(isPlatformBrowser(this.platformId), 'Is platform browser?');
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('userDetails');
      const currentUser = userJson !== null ? JSON.parse(userJson) : {};
      if (!currentUser) {
        return;
      }

      const loadedUser = new User(
        currentUser.name,
        currentUser.email,
        currentUser.phone,
        currentUser.id,
        currentUser._token,
        new Date(currentUser._tokenExpirationDate),
      );
      if (currentUser._token) {
        this.user.next(loadedUser);
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  getUserDetails() {
    if (isPlatformBrowser(this.platformId)) {
      const userJson = localStorage.getItem('userDetails');
      return userJson !== null ? JSON.parse(userJson) : {};
    }
    return {};
  }
  updateUserDetails(updatedDetails: any) {
    return this.http
      .put<authResponseData>(
        this.baseUrl + '/auth/update-profile',
        updatedDetails,
      )
      .pipe(
        catchError(this.handleError),
        tap((res) => {
          this.handleAuthentication(res);
        }),
      );
  }

  private handleAuthentication(response: authResponseData) {
    const expirationDate = new Date(
      new Date().getTime() + +response.expiresIn * 1000,
    );
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(
        'userDetails',
        JSON.stringify({
          name: response.name,
          email: response.email,
          phone: response.phone,
          id: response.id,
          _token: response.token,
          _tokenExpirationDate: expirationDate,
        }),
      );
    }
    const user = new User(
      response.name,
      response.email,
      response.phone,
      response.id,
      response.token,
      expirationDate,
    );
    this.user.next(user);
  }
}
