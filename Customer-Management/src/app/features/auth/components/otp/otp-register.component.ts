import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmOTPRegister } from '../../../../core/models/otp.model';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-register.html',
  styleUrls: ['./otp-register.css'],
})
export class OtpRegisterComponent {
  confirmOTPData: ConfirmOTPRegister = {} as ConfirmOTPRegister;
  isLoading: boolean = false;

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

  onConfirmRegisterOTP(form: NgForm) {
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.confirmOTPRegister(this.confirmOTPData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          this.isLoading = false;
          return;
        }

        this.isLoading = false;
        this.router.navigate(['/authen']);
      },
      error: (err) => {
        this.toastService.error('OTP verification failed');
        this.isLoading = false;
      }
    });
  }
}