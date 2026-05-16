import { Component } from '@angular/core';
import { confirmOTPForgotPassword } from '../../../../core/models/otp.model';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPasswordComponent {

  confirmOTPForgotPasswordData: confirmOTPForgotPassword = {} as confirmOTPForgotPassword;
  isLoading: boolean = false;
  showNewPassword: boolean = false;
  showConfirmPassword: boolean = false;

  constructor(
    private authenService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const email = localStorage.getItem('email');
    const otp = localStorage.getItem('forgot_password_otp');
    if (email && otp) {
      this.confirmOTPForgotPasswordData.email = email;
      this.confirmOTPForgotPasswordData.otp = otp;
    }
  }

  toggleNewPassword(): void {
    this.showNewPassword = !this.showNewPassword;
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  onResetPassword(form: NgForm){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.confirmOTPForgotPassword(this.confirmOTPForgotPasswordData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          this.isLoading = false;
          return;
        }

        this.toastService.success('Password reset successfully!');
        this.isLoading = false;
        setTimeout(() => this.router.navigate(['/authen']), 2000);
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to reset password');
        this.isLoading = false;
      }
    });
  }
}