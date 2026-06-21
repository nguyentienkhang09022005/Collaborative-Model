import { HttpInterceptorFn, HttpErrorResponse, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      console.log('[ErrorInterceptor] Error caught:', error.status, error.statusText);

      // Handle 401 Unauthorized - try refresh token
      if (error.status === 401 && !req.headers.has('X-Retry-Attempt')) {
        console.log('[ErrorInterceptor] 401 received, attempting token refresh...');
        // Try to refresh the token
        return authService.refreshToken().pipe(
          switchMap((success) => {
            console.log('[ErrorInterceptor] Refresh result:', success);
            if (success) {
              // Retry the original request with new token
              const newToken = authService.getAccessToken();
              console.log('[ErrorInterceptor] Retrying request with new token:', newToken?.substring(0, 20) + '...');
              const retryReq = req.clone({
                setHeaders: {
                  Authorization: `Bearer ${newToken}`
                },
                headers: req.headers.set('X-Retry-Attempt', 'true')
              });
              return next(retryReq);
            } else {
              // Refresh failed - clear local state and send user to login.
              // We don't call authService.logout() here because that BE call would
              // itself return 401 (expired token) and re-trigger this interceptor.
              // The server-side refresh cookie will expire on its own.
              console.log('[ErrorInterceptor] Refresh failed, clearing state and redirecting to login');
              authService.clearLocalState();
              router.navigate(['/authen']);
              return throwError(() => new Error('Token expired and refresh failed'));
            }
          })
        );
      }

      let errorMessage = 'An unexpected error occurred';

      if (error.error instanceof ErrorEvent) {
        errorMessage = error.error.message;
      } else {
        errorMessage = error.error?.message || `Error: ${error.status}`;
      }

      console.error('HTTP Error:', errorMessage);
      return throwError(() => new Error(errorMessage));
    })
  );
};