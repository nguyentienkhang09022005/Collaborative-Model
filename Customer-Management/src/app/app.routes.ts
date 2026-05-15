import { Routes } from '@angular/router';
import { AuthenComponent } from './features/auth/pages/authen/authen.component';
import { MainLayoutComponent } from './layouts/main-layout/main-layout.component';
import { DashboardComponent } from './features/dashboard/pages/dashboard/dash-board.component';
import { RegisterComponent } from './features/auth/pages/register/register.component';
import { OtpRegisterComponent } from './features/auth/components/otp/otp-register.component';
import { ForgotPasswordComponent } from './features/auth/pages/forgot-password/forgot-password.component';
import { OtpForgotPasswordComponent } from './features/auth/components/otp/otp-forgot-password.component';
import { ResetPasswordComponent } from './features/auth/pages/reset-password/reset-password.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { ContactListComponent } from './features/contacts/pages/contact-list/contact-list.component';
import { CustomerListComponent } from './features/customers/pages/customer-list/customer-list.component';
import { DealListComponent } from './features/deals/pages/deal-list/deal-list.component';
import { LeadListComponent } from './features/leads/pages/lead-list/lead-list.component';
import { LeadDetailComponet } from './features/leads/pages/lead-detail/lead-detail.component';
import { CustomerDetailComponet } from './features/customers/pages/customer-detail/customer-detail.component';
import { ContactDetailComponent } from './features/contacts/pages/contact-detail/contact-detail.component';
import { DealDetailComponent } from './features/deals/pages/deal-detail/deal-detail.component';
import { LeadMarkComponent } from './features/leads/components/lead-mark/lead-mark.component';

export const routes: Routes = [
    // Authen
    { path: 'authen', component: AuthenComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'forgot-password', component: ForgotPasswordComponent },
    { path: 'otp-register', component: OtpRegisterComponent },
    { path: 'otp-forgot-password', component: OtpForgotPasswordComponent },
    { path: 'reset-password', component: ResetPasswordComponent },

    // Mark
    { path: 'lead-mark', component: LeadMarkComponent },

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
            { path: 'contacts', component: ContactListComponent },
            { path: 'contact-detail', component: ContactDetailComponent },
            { path: 'deals', component: DealListComponent },
            { path: 'deal-detail', component: DealDetailComponent },
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'dashboard' }
];
