import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {
  private router = inject(Router);
  private authService = inject(AuthService);

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (!this.authService.getAccessToken()) {
      this.router.navigate(['/authen']);
      return false;
    }

    const requiredRoles = (route.data?.['roles'] as string[] | undefined) ?? [];
    const userRole = this.authService.getCurrentUserRole();

    if (requiredRoles.length === 0 || (userRole !== null && requiredRoles.includes(userRole))) {
      return true;
    }

    this.router.navigate(['/app/dashboard']);
    return false;
  }
}
