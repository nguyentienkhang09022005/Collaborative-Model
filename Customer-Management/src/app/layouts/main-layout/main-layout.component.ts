import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { InfStaff } from '../../core/models/auth.models';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent {

  currentStaff: InfStaff | null = null;
  constructor (private authenService: AuthService,
               private router: Router){}

  ngOnInit(): void{
    this.currentStaff = this.authenService.getCurrentStaff();
  }

  onLogout(event?: Event){
    if (event) event.preventDefault(); 
    this.authenService.logout().subscribe({
      next: (res) => {
        if (res.errors && res.errors.length > 0) {
          alert(res.errors[0].message);
          return;
        }
        
        this.router.navigate(['/authen'])
      },
      error: (err) => {console.log("Lỗi đăng xuất!", err)}
    })
  }
}
