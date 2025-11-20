import { Routes } from '@angular/router';
import { AuthenComponent } from './features/auth/authen/authen.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dash-board/dash-board.component';
import { RegisterComponent } from './features/auth/register/register.component';
import { OtpRegisterComponent } from './shared/components/otp-register/otp-register.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { OtpForgotPasswordComponent } from './shared/components/otp-forgot-password/otp-forgot-password.component';
import { ResetPasswordComponent } from './features/auth/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { ContactPageComponent } from './features/contact-page/contact-page.component';
import { CustomerListComponent } from './features/customer/customer-list/customer-list.component';
import { DealPageComponent } from './features/deal-page/deal-page.component';
import { LeadListComponent } from './features/leads/lead-list/lead-list.component';
import { LeadDetailComponet } from './features/leads/lead-detail/lead-detail.component';
import { CustomerDetailComponet } from './features/customer/customer-detail/customer-detail.component';

export const routes: Routes = [
    // Authen
    { path: 'authen', component: AuthenComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'otp-register', component: OtpRegisterComponent },
    { path: 'otp-forgot-password', component: OtpForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

    // Main
    {
        path: '',
        component: MainLayoutComponent,
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: 
        [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'leads', component: LeadListComponent },
            { path: 'lead-detail', component: LeadDetailComponet },
            { path: 'customers', component: CustomerListComponent },
            { path: 'customer-detail', component: CustomerDetailComponet },
            { path: 'contacts', component: ContactPageComponent },
            { path: 'deals', component: DealPageComponent },
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'dashboard' }
];
