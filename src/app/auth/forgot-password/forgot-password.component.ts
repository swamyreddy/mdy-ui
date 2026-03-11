import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AlertService } from 'src/app/shared/alert/alert.service';
import { AuthService } from '../auth.service';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'],
})
export class ForgotPasswordComponent {
  phone = '';
  password = '';
  confirmPassword = '';
  step = 1;
  otpDigits = new Array(4);
  otp: string = '';
  otpSent = false;
  otpVerified = false;
  countdown = 60;

  timer: any;

  @ViewChildren('otpInput') inputs!: QueryList<ElementRef>;

  constructor(
    private alertService: AlertService,
    private authService: AuthService,
  ) {}
  sendOtp(phone: string) {
    if (!phone || phone.length < 10) {
      this.alertService.warn('Enter valid phone number');
      return;
    }

    this.phone = phone;

    this.authService.sendResetPwdOtp(phone).subscribe({
      next: () => {
        this.otpSent = true;
        this.alertService.success('OTP sent');
      },
      error: () => {
        this.alertService.error('Failed to send OTP');
      },
    });

    this.step = 2;
  }

  verifyOtp() {
    this.authService.verifyResetPwdOtp(this.phone, this.otp).subscribe({
      next: () => {
        this.otpVerified = true;
        this.alertService.success('OTP verified');
        this.step = 3;
      },

      error: () => {
        this.alertService.error('Invalid OTP');
      },
    });
  }

  resetPassword() {
    if (this.password !== this.confirmPassword) {
      this.alertService.error('Passwords do not match');
      return;
    }
    this.authService.resetPassword(this.phone, this.password).subscribe({
      next: () => {
        this.alertService.success('Password changed successfully!');
      },

      error: (err) => {
        this.alertService.error(
          err.message || 'Error accured while saving password!',
        );
      },
    });
  }

  resendOtp() {
    console.log('Resend OTP API');

    this.startTimer();
  }

  startTimer() {
    this.countdown = 60;

    this.timer = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(this.timer);
      }
    }, 1000);
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
    this.getOtp();
  }

  onKeyDown(event: any, index: number) {
    if (event.key === 'Backspace' && !this.otp[index] && index > 0) {
      this.inputs.toArray()[index - 1].nativeElement.focus();
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

    this.getOtp();
  }

  getOtp() {
    // return this.otp.join('');
    const inputs = document.querySelectorAll('.otp-input');

    this.otp = Array.from(inputs)
      .map((input: any) => input.value)
      .join('');
  }
}
