import { Routes } from '@angular/router';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { AuthGuard } from './guards/auth/auth.guard';

export const routes: Routes = [
    // Authen
    {
        path: 'authen',
        loadComponent: () =>
            import('./features/auth/pages/authen/authen.component').then(m => m.AuthenComponent),
    },
    {
        path: 'forgot-password',
        loadComponent: () =>
            import('./features/auth/pages/forgot-password/forgot-password.component').then(m => m.ForgotPasswordComponent),
    },
    {
        path: 'otp-register',
        loadComponent: () =>
            import('./features/auth/components/otp/otp-register.component').then(m => m.OtpRegisterComponent),
    },
    {
        path: 'otp-forgot-password',
        loadComponent: () =>
            import('./features/auth/components/otp/otp-forgot-password.component').then(m => m.OtpForgotPasswordComponent),
    },
    {
        path: 'reset-password',
        loadComponent: () =>
            import('./features/auth/pages/reset-password/reset-password.component').then(m => m.ResetPasswordComponent),
    },

    // Mark
    {
        path: 'lead-mark',
        loadComponent: () =>
            import('./features/leads/components/lead-mark/lead-mark.component').then(m => m.LeadMarkComponent),
    },

    // Main
    {
        path: '',
        loadComponent: () =>
            import('./layouts/main-layout/main-layout.component').then(m => m.MainLayoutComponent),
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () =>
                    import('./features/dashboard/pages/dashboard/dash-board.component').then(m => m.DashboardComponent),
                providers: [provideCharts(withDefaultRegisterables())],
            },
            {
                path: 'leads',
                loadComponent: () =>
                    import('./features/leads/pages/lead-list/lead-list.component').then(m => m.LeadListComponent),
            },
            {
                path: 'lead-detail',
                loadComponent: () =>
                    import('./features/leads/pages/lead-detail/lead-detail.component').then(m => m.LeadDetailComponet),
            },
            {
                path: 'customers',
                loadComponent: () =>
                    import('./features/customers/pages/customer-list/customer-list.component').then(m => m.CustomerListComponent),
            },
            {
                path: 'customer-detail',
                loadComponent: () =>
                    import('./features/customers/pages/customer-detail/customer-detail.component').then(m => m.CustomerDetailComponet),
            },
            {
                path: 'contacts',
                loadComponent: () =>
                    import('./features/contacts/pages/contact-list/contact-list.component').then(m => m.ContactListComponent),
            },
            {
                path: 'contact-detail',
                loadComponent: () =>
                    import('./features/contacts/pages/contact-detail/contact-detail.component').then(m => m.ContactDetailComponent),
            },
            {
                path: 'deals',
                loadComponent: () =>
                    import('./features/deals/pages/deal-list/deal-list.component').then(m => m.DealListComponent),
            },
            {
                path: 'deal-detail',
                loadComponent: () =>
                    import('./features/deals/pages/deal-detail/deal-detail.component').then(m => m.DealDetailComponent),
            },
            {
                path: 'staff',
                loadComponent: () =>
                    import('./features/staff/pages/staff-list/staff-list.component').then(m => m.StaffListComponent),
            },
            {
                path: 'tasks',
                loadComponent: () =>
                    import('./features/tasks/pages/task-list/task-list.component').then(m => m.TaskListComponent),
            },
            {
                path: 'tasks/:id',
                loadComponent: () =>
                    import('./features/tasks/pages/task-detail/task-detail.component').then(m => m.TaskDetailComponent),
            },
            {
                path: 'notifications',
                loadComponent: () =>
                    import('./features/notifications/pages/notification-list/notification-list.component').then(m => m.NotificationListComponent),
            },
            {
                path: 'calendar',
                loadComponent: () =>
                    import('./features/calendar/pages/calendar-list/calendar-list.component').then(m => m.CalendarListComponent),
            },
            {
                path: 'audit-log',
                loadComponent: () =>
                    import('./features/audit-log/pages/audit-log-list/audit-log-list.component').then(m => m.AuditLogListComponent),
            },
            {
                path: 'reports',
                loadComponent: () =>
                    import('./features/reports/pages/report-list/report-list.component').then(m => m.ReportListComponent),
            },
            {
                path: 'settings',
                loadComponent: () =>
                    import('./features/settings/pages/settings/settings.component').then(m => m.SettingsComponent),
            },
        ]
    },

    // Fallback
    { path: '**', redirectTo: 'dashboard' }
];
