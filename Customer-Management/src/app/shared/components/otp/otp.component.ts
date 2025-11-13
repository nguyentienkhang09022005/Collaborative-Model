import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { ConfirmOTP } from '../../../core/models/otp.model';

@Component({
  selector: 'app-otp',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './otp.html',
  styleUrls: ['./otp.css'],
})
export class OtpComponent {

  // Input confirmOTP
  confirmOTPData: ConfirmOTP = {} as ConfirmOTP;
  isLoading: boolean = false;

  constructor(private authenService: AuthService, 
              private router: Router){}
              
  ngOnInit(): void{
    const email = localStorage.getItem('email')
    if (email) {
      this.confirmOTPData.email = email;
      console.log('Email tự động điền:', email);
    } else {
      console.warn('Không tìm thấy email trong localStorage!');
    }
  }

  onConfirmOTP(form: NgForm){
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.validateOTP(this.confirmOTPData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          this.isLoading = false;
          return;
        }
        
        console.log("Xác thực thành công!", res);
        this.isLoading = false;
        this.router.navigate(['/authen'])
      },
      error: (err) => {console.log("Lỗi xác thực OTP!", err);
      this.isLoading = false;
      }
    })
  }
}
