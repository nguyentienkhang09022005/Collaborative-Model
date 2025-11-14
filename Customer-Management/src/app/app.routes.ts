import { Routes } from '@angular/router';
import { AuthenComponent } from './features/auth/authen/authen.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dash-board/dash-board';
import { RegisterComponent } from './features/auth/register/register.component';
import { OtpRegisterComponent } from './shared/components/otp-register/otp-register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { OtpForgotPasswordComponent } from './shared/components/otp-forgot-password/otp-forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';

export const routes: Routes = [
    // Authen
    { path: 'authen', component: AuthenComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'otp-register', component: OtpRegisterComponent },
    { path: 'otp-forgot-password', component: OtpForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

    // Main
    { path: '', 
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'dashboard' }
];
