import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { sendOTPForgotPassword } from '../../../core/models/otp.model';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css'],
})
export class ForgotPasswordComponent {
  
  sendOTPForgotPasswordData: sendOTPForgotPassword = {} as sendOTPForgotPassword;
  isLoading: boolean = false;

  constructor(private authenService: AuthService,
              private router: Router){}

  ngOnInit(): void{}

  onSendOTPForgotPassword(form: NgForm){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched(); 
    });
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.sendOTPforgotPassword(this.sendOTPForgotPasswordData).subscribe({
      next: (res) => {
      if (res.errors && res.errors.length > 0) {
        alert(res.errors[0].message);
        this.isLoading = false;
        return;
      }
   
      console.log(res);
      this.isLoading = false;
      this.router.navigate(['/otp-forgot-password'])
      },
      error: (err) => {console.log("Lỗi nhập email!", err);
        this.isLoading = false;
      }
    })
  }
}
