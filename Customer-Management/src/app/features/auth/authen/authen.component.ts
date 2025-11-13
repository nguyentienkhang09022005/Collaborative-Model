import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Authen } from '../../../core/models/auth.models';
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
  authData: Authen = {} as Authen;
  isLoading: boolean = false;

  constructor(private authenService: AuthService, 
              private router: Router){}

  ngOnInit(): void{}

  onLogin(form: NgForm){
    if (form.invalid) return;

    this.isLoading = true;
    this.authenService.authen(this.authData).subscribe({
      next: (res) => {
        console.log("Đăng nhập thành công!", res);
        this.isLoading = false;
        this.router.navigate(['/dashboard'])
      },
      error: (err) => {console.log("Lỗi đăng nhập!", err);
      this.isLoading = false;
      }
    })
  }
}
