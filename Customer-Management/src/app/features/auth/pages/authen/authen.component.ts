import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from '../../../../core/models/auth.models';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';
import { ToastComponent } from '../../../../shared/components/toast/toast.component';

@Component({
  selector: 'app-authen',
  standalone: true,
  imports: [CommonModule, FormsModule, ToastComponent],
  templateUrl: './authen.html',
  styleUrls: ['./authen.css'],
})
export class AuthenComponent {

  loginData: Login = {} as Login;
  isLoading: boolean = false;
  showPassword: boolean = false;

  constructor(
    private authenService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onLogin(form: NgForm){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched();
    });
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.authen(this.loginData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          this.toastService.error(res.errors[0].message);
          this.isLoading = false;
          return;
        }

        this.isLoading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.toastService.error(err.message || 'Login failed');
        this.isLoading = false;
      }
    });
  }
}