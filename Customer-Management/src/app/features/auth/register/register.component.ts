import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Register } from '../../../core/models/register.model';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'],
})
export class RegisterComponent {

  // Input Register
  registerData: Register = {} as Register
  isLoading: boolean = false;

  constructor(private authenService: AuthService, 
              private router: Router){}
              
  ngOnInit(): void{}

  onRegister(form: NgForm){
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.register(this.registerData).subscribe({
      next: (res) => {
      if (res.errors && res.errors.length > 0) {
        alert(res.errors[0].message);
        this.isLoading = false;
        return;
      }
   
      console.log(res);
      this.isLoading = false;
      this.router.navigate(['/otp-register'])
      },
      error: (err) => {console.log("Lỗi đăng ký!", err);
      this.isLoading = false;
      }
    })
  }
}


