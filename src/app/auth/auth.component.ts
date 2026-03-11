import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { AlertService } from '../shared/alert/alert.service';
import { AuthService } from './auth.service';
import { ModalService } from '../shared/modal.service';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  isLogin: boolean = true;
  isLoading: boolean = false;
  otpSent = false;
  otpVerified = false;
  otp: string = '';
  phoneNumber = '';
  otpDigits = new Array(4);

  countdown = 60;
  timer: any;
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
  sendOtp(phone: string) {
    if (!phone || phone.length < 10) {
      this.alertService.warn('Enter valid phone number');
      return;
    }

    this.phoneNumber = phone;

    this.authService.sendOTP({ phone }).subscribe({
      next: () => {
        this.otpSent = true;
        this.alertService.success('OTP sent');
      },
      error: () => {
        this.alertService.error('Failed to send OTP');
      },
    });
  }
  verifyOtp() {
    this.authService
      .verifyOTP({
        phone: this.phoneNumber,
        otp: this.otp,
      })
      .subscribe({
        next: () => {
          this.otpVerified = true;
          this.alertService.success('Phone verified');
        },

        error: () => {
          this.alertService.error('Invalid OTP');
        },
      });
  }

  onOtpInput(event: any, index: number) {
    const input = event.target;
    const value = input.value;

    if (!/^[0-9]$/.test(value)) {
      input.value = '';
      return;
    }

    const inputs = document.querySelectorAll('.otp-input');

    if (index < inputs.length - 1) {
      (inputs[index + 1] as HTMLElement).focus();
    }

    this.collectOtp();
  }
  onKeyDown(event: KeyboardEvent, index: number) {
    const inputs = document.querySelectorAll('.otp-input');

    if (
      event.key === 'Backspace' &&
      !(event.target as HTMLInputElement).value
    ) {
      if (index > 0) {
        (inputs[index - 1] as HTMLElement).focus();
      }
    }
  }
  onPaste(event: ClipboardEvent) {
    event.preventDefault();

    const pastedData = event.clipboardData?.getData('text').trim() || '';

    if (!/^\d{6}$/.test(pastedData || '')) return;

    const inputs = document.querySelectorAll('.otp-input');

    pastedData.split('').forEach((num, i) => {
      (inputs[i] as HTMLInputElement).value = num;
    });

    this.collectOtp();
  }
  collectOtp() {
    const inputs = document.querySelectorAll('.otp-input');

    this.otp = Array.from(inputs)
      .map((input: any) => input.value)
      .join('');
  }
  startTimer() {
    this.countdown = 60;

    this.timer = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.timer);
      }
    }, 1000);
  }
  resendOtp() {
    this.sendOtp(this.phoneNumber);
  }
  openForgotPasswordPage() {
    this.modalService.close();
    this.modalService.open(ForgotPasswordComponent);
  }
}
