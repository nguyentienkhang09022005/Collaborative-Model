import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OTPForgotPassword } from '../../../../core/models/otp.model';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-otp-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './otp-forgot-password.html',
  styleUrl: './otp-forgot-password.css',
})
export class OtpForgotPasswordComponent {
  OTPData: OTPForgotPassword = {} as OTPForgotPassword;
  isLoading: boolean = false;
  otpDigits: string[] = ['', '', '', '', '', ''];

  constructor(private router: Router, private toastService: ToastService){}

  ngOnInit(): void{}

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
    this.OTPData.otp = this.otpDigits.join('');
  }

  onConfirmForgotPasswordOTP(form: NgForm){
    if (this.otpDigits.join('').length !== 6) {
      this.toastService.error('Please enter complete 6-digit OTP');
      return;
    }

    this.isLoading = true;
    localStorage.setItem('forgot_password_otp', this.OTPData.otp);
    this.toastService.success('OTP verified!');
    this.isLoading = false;
    setTimeout(() => this.router.navigate(['/reset-password']), 1500);
  }
}