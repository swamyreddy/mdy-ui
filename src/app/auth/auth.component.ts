import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertService } from '../shared/alert/alert.service';
import { AuthService } from './auth.service';
import { ModalService } from '../shared/modal.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLogin: boolean = true;
  isLoading: boolean = false;
  constructor(
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService,
    private modalService: ModalService,
  ) {}

  ngOnInit(): void {
    // this.authService.logout();
    // if (this.authService.isLoggedIn()) this.router.navigateByUrl('home');
    this.authService.autoLogin();
    if (this.router.url == '/login') this.isLogin = true;
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return;
    }

    this.isLoading = true;
    if (this.isLogin) {
      this.authService.signin(form.value).subscribe(
        (result) => {
          this.alertService.success('Login Success!');
          this.router.navigateByUrl('/home');
          this.isLoading = false;
          this.modalService.close();
        },
        (err) => {
          this.alertService.error(err);
          this.isLoading = false;
        },
      );
    } else {
      this.authService.signup(form.value).subscribe(
        (result) => {
          this.alertService.success('User Registered!');
          this.isLoading = false;
          this.modalService.close();
        },
        (err) => {
          const errorMsg = err?.error?.error?.msg || 'Something went wrong!!';
          this.alertService.error(errorMsg);
          this.isLoading = false;
          console.log(err, 'err+++');
        },
      );
    }
  }
}
