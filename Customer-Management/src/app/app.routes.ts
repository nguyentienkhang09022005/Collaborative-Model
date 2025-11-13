import { Routes } from '@angular/router';
import { AuthenComponent } from './features/auth/authen/authen.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dash-board/dash-board';
import { RegisterComponent } from './features/auth/register/register.component';
import { OtpComponent } from './shared/components/otp/otp.component';

export const routes: Routes = [
    // Authen
    { path: 'authen', component: AuthenComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'otp-register', component: OtpComponent },

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
