import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { OTPForgotPassword } from '../../../core/models/otp.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp-forgot-password.html',
  styleUrl: './otp-forgot-password.css',
})
export class OtpForgotPasswordComponent {
  // Input confirmOTP
  OTPData: OTPForgotPassword = {} as OTPForgotPassword;
  isLoading: boolean = false;

  constructor(private router: Router){}
              
  ngOnInit(): void{}

  onConfirmForgotPasswordOTP(form: NgForm){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched(); 
    });
    if (form.invalid) return;

    this.isLoading = true;
    
    localStorage.setItem('forgot_password_otp', this.OTPData.otp);
    console.log("Đã lưu otp", this.OTPData.otp);
    

    this.isLoading = false;
    this.router.navigate(['/reset-password']);
  }
}
