import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Login } from '../../../core/models/auth.models';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-authen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './authen.html',
  styleUrls: ['./authen.css'],
})
export class AuthenComponent {
  
  // Input Login
  loginData: Login = {} as Login;
  isLoading: boolean = false;

  constructor(private authenService: AuthService, 
              private router: Router){}

  ngOnInit(): void{}

  onLogin(form: NgForm){
    Object.values(form.controls).forEach(control => {
      control.markAsTouched(); 
    });
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.authen(this.loginData).subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          this.isLoading = false;
          return;
        }
        
        console.log(res);
        this.isLoading = false;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {console.log("Lỗi đăng nhập!", err);
        this.isLoading = false;
      }
    })
  }
}
