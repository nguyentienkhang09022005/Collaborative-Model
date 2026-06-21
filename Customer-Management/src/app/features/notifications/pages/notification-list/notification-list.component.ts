import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PaginatorComponent, PaginatorChange } from '../../../../shared/components/paginator/paginator.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { AuthService } from '../../../../core/services/auth.service';
import { ToastService } from '../../../../core/services/toast.service';
import { PreferenceService } from '../../../../core/services/preference.service';
import { NotificationItem } from '../../../../core/models/notification.model';
import {
  NOTIFICATION_TYPE_LABELS,
  NOTIFICATION_TYPE_COLORS
} from '../../../../core/models/notification.model';

@Component({
  selector: 'app-notification-list',
  standalone: true,
  imports: [CommonModule, PaginatorComponent],
  templateUrl: './notification-list.html',
})
export class NotificationListComponent implements OnInit, OnDestroy {
  notifications: NotificationItem[] = [];
  isLoading = true;
  currentStaffId = '';

  pageIndex = 0;
  pageSize = 10;
  totalCount = 0;

  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  typeLabels = NOTIFICATION_TYPE_LABELS;
  typeColors = NOTIFICATION_TYPE_COLORS;

  private pollInterval: ReturnType<typeof setInterval> | null = null;

  constructor(
    private notificationService: NotificationService,
    private authService: AuthService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const staff = this.authService.getCurrentStaff();
    this.currentStaffId = staff?.id || '';

    this.loadNotifications();

    // Poll every 30 seconds
    this.pollInterval = setInterval(() => {
      this.loadNotifications();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.pollInterval) {
      clearInterval(this.pollInterval);
    }
  }

  loadNotifications(): void {
    this.isLoading = true;
    this.notificationService.GetNotificationsPaged(this.currentStaffId, this.pageIndex + 1, this.pageSize).subscribe({
      next: (res) => {
        this.notifications = res.items;
        this.totalCount = res.totalCount;
        this.isLoading = false;
      },
      error: (err) => {
        this.toastService.error('Failed to load notifications');
        this.isLoading = false;
      }
    });
  }

  onPageChange(e: PaginatorChange): void {
    this.pageIndex = e.pageIndex;
    this.pageSize = e.pageSize;
    this.loadNotifications();
  }

  markAsRead(idNotification: string): void {
    this.notificationService.markAsRead(idNotification).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.idNotification === idNotification);
        if (notification) {
          notification.isRead = true;
        }
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to mark as read');
      }
    });
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead(this.currentStaffId).subscribe({
      next: () => {
        this.notifications.forEach(n => n.isRead = true);
        this.toastService.success('All notifications marked as read');
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to mark all as read');
      }
    });
  }

  pinNotification(idNotification: string): void {
    this.notificationService.pinNotification(idNotification).subscribe({
      next: () => {
        const notification = this.notifications.find(n => n.idNotification === idNotification);
        if (notification) {
          notification.isPinned = !notification.isPinned;
        }
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to pin notification');
      }
    });
  }

  deleteNotification(idNotification: string): void {
    this.notificationService.deleteNotification(idNotification).subscribe({
      next: () => {
        this.notifications = this.notifications.filter(n => n.idNotification !== idNotification);
        this.toastService.success('Notification deleted');
      },
      error: (err) => {
        this.toastService.error(err.message || 'Failed to delete notification');
      }
    });
  }

  navigateToEntity(notification: NotificationItem): void {
    if (!notification.isRead) {
      this.markAsRead(notification.idNotification);
    }

    if (notification.relatedEntityType && notification.relatedEntityId) {
      const routeMap: Record<string, { path: string; useQueryParam: boolean }> = {
        'Task': { path: '/app/tasks', useQueryParam: false },
        'Lead': { path: '/app/lead-detail', useQueryParam: true },
        'Customer': { path: '/app/customer-detail', useQueryParam: true },
        'Contact': { path: '/app/contact-detail', useQueryParam: true },
        'Deal': { path: '/app/deal-detail', useQueryParam: true }
      };
      const route = routeMap[notification.relatedEntityType];
      if (route) {
        if (route.useQueryParam) {
          this.router.navigate([route.path], { queryParams: { id: notification.relatedEntityId } });
        } else {
          this.router.navigate([route.path, notification.relatedEntityId]);
        }
      } else {
        this.router.navigate(['/notifications']);
      }
    }
  }

  getRouteForEntity(entityType: string, entityId: string): string {
    switch (entityType) {
      case 'Lead': return '/lead-detail';
      case 'Customer': return '/customer-detail';
      case 'Contact': return '/contact-detail';
      case 'Deal': return '/deal-detail';
      case 'Task': return `/tasks/${entityId}`;
      default: return '/notifications';
    }
  }

  getTypeClass(type: string): string {
    if (this.themeConfig().id === 'dark') {
      const darkColors: Record<string, string> = {
        'SUCCESS': 'bg-green-900 text-green-200',
        'WARNING': 'bg-amber-900 text-amber-200',
        'ERROR': 'bg-red-900 text-red-200',
        'INFO': 'bg-blue-900 text-blue-200',
        'APPOINTMENT': 'bg-purple-900 text-purple-200'
      };
      return darkColors[type] || 'bg-slate-700 text-slate-200';
    }
    return this.typeColors[type] || 'bg-slate-100 text-slate-600';
  }

  getTypeLabel(type: string): string {
    return this.typeLabels[type] || type;
  }

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
  }

  getUnreadCount(): number {
    return this.notifications.filter(n => !n.isRead).length;
  }

  getPinnedNotifications(): NotificationItem[] {
    return this.notifications.filter(n => n.isPinned);
  }

  getUnreadNotifications(): NotificationItem[] {
    return this.notifications.filter(n => !n.isRead);
  }
}