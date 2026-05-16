import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from '../../../../core/models/auth.models';
import { AuthService } from '../../../../core/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-authen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authen.html',
  styleUrls: ['./authen.css'],
})
export class AuthenComponent {

  loginData: Login = {} as Login;
  isLoading: boolean = false;

  constructor(
    private authenService: AuthService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {}

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
        this.toastService.error('Login failed');
        this.isLoading = false;
      }
    });
  }
}