import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmOTPRegister } from '../../../../core/models/otp.model';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, LogoComponent],
  templateUrl: './otp-register.html',
  styleUrls: ['./otp-register.css'],
})
export class OtpRegisterComponent {
  confirmOTPData: ConfirmOTPRegister = {} as ConfirmOTPRegister;
  isLoading: boolean = false;
  otpDigits: string[] = ['', '', '', '', '', ''];

  constructor(
    private authenService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.confirmOTPData.email = email;
    }
  }

  onOtpInput(event: Event, index: number): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '');
    this.otpDigits[index] = value;

    if (value && index < 5) {
      const nextInput = input.nextElementSibling as HTMLInputElement;
      if (nextInput) nextInput.focus();
    }

    this.updateOtpValue();
  }

  onOtpKeydown(event: KeyboardEvent, index: number): void {
    if (event.key === 'Backspace' && !this.otpDigits[index] && index > 0) {
      const prevInput = (event.target as HTMLInputElement).previousElementSibling as HTMLInputElement;
      if (prevInput) {
        this.otpDigits[index - 1] = '';
        prevInput.focus();
      }
    }
  }

  private updateOtpValue(): void {
    this.confirmOTPData.otp = this.otpDigits.join('');
  }

  onConfirmRegisterOTP(form: NgForm) {
    if (this.otpDigits.join('').length !== 6) {
      this.toastService.error('Please enter complete 6-digit OTP');
      return;
    }

    this.isLoading = true;
    this.authenService.confirmOTPRegister(this.confirmOTPData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          this.isLoading = false;
          return;
        }

        this.toastService.success('Account verified successfully!');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/authen']), 2000);
      },
      error: (err) => {
        this.toastService.error(err.message || 'OTP verification failed');
        this.isLoading = false;
      }
    });
  }
}