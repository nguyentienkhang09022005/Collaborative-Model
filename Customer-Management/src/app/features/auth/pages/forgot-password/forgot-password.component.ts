import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../../core/services/auth.service';
import { Router } from '@angular/router';
import { sendOTPForgotPassword } from '../../../../core/models/otp.model';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';
import { LogoComponent } from '../../../../shared/components/logo/logo.component';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent, LogoComponent],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {

  sendOTPForgotPasswordData: sendOTPForgotPassword = {} as sendOTPForgotPassword;
  isLoading: boolean = false;

  constructor(
    private authenService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  onSendOTPForgotPassword(form: NgForm){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.sendOTPforgotPassword(this.sendOTPForgotPasswordData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          this.isLoading = false;
          return;
        }

        this.toastService.success('Reset link sent! Check your email.');
        this.isLoading = false;
        this.router.navigate(['/otp-forgot-password']);
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to send reset link');
        this.isLoading = false;
      }
    });
  }
}