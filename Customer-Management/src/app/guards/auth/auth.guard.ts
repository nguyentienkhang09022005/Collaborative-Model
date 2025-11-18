import { Injectable } from '@angular/core';
import { CanActivate, CanActivateChild, Router } from '@angular/router';

@Injectable({
  providedIn: 'root' 
})
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const accessToken = localStorage.getItem('access_token');

    if (accessToken) return true;

    this.router.navigate(['/authen']);
    return false;
  }

  canActivateChild(): boolean {
    return this.canActivate();
  }
}
