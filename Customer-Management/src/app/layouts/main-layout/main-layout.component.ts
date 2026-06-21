import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnDestroy, HostListener, inject, computed } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from '../../core/services/auth.service';
import { InfStaff } from '../../core/models/auth.models';
import { FormsModule } from '@angular/forms';
import { ToastComponent } from '../../shared/components/toast/toast.component';
import { ToastService } from '../../core/services/toast.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../core/services/notification.service';
import { NotificationItem } from '../../core/models/notification.model';
import { PreferenceService } from '../../core/services/preference.service';
import { AiService } from '../../core/services/ai.service';
import { HistoryMessageItem } from '../../core/models/ai.model';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, FormsModule, ToastComponent, ConfirmDialogComponent],
  templateUrl: './main-layout.html',
  styleUrl: './main-layout.css',
})
export class MainLayoutComponent implements OnDestroy {
  @ViewChild('chatContainer') chatContainer!: ElementRef;

  currentStaff: InfStaff | null = null;
  showLogoutDialog: boolean = false;
  unreadNotificationCount: number = 0;

  // Notification dropdown
  showNotificationDropdown: boolean = false;
  recentNotifications: NotificationItem[] = [];

  isChatOpen = false;
  isChatBoxOpen = false;
  newMessage: string = '';
  aiTyping: boolean = false;
  isChatThinking: boolean = false;
  historyMessageItem: HistoryMessageItem[] = [];

  private notificationPollInterval: ReturnType<typeof setInterval> | null = null;

  // Preference service for theme
  private preferenceService = inject(PreferenceService);
  readonly themeConfig = this.preferenceService.themeConfig;

  constructor(
    private authenService: AuthService,
    private aiService: AiService,
    private router: Router,
    private toastService: ToastService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.currentStaff = this.authenService.getCurrentStaff();
    this.onListHistoryMessage(this.currentStaff?.id || "");
    this.loadWelcomeMessage();

    // setInterval(() => {
    //   this.showChatThinking();
    // }, 20000);

    // Load unread notification count
    this.loadUnreadNotificationCount();

    // Poll for new notifications every 30 seconds
    this.notificationPollInterval = setInterval(() => {
      this.loadUnreadNotificationCount();
    }, 30000);
  }

  ngOnDestroy(): void {
    if (this.notificationPollInterval) {
      clearInterval(this.notificationPollInterval);
    }
  }

  loadUnreadNotificationCount(): void {
    if (!this.currentStaff?.id) return;

    this.notificationService.GetUnreadCount(this.currentStaff.id).subscribe({
      next: (count) => {
        this.unreadNotificationCount = count;
      },
      error: (err) => {
        console.log('Error loading notification count:', err);
      }
    });
  }

  toggleNotificationDropdown(): void {
    this.showNotificationDropdown = !this.showNotificationDropdown;
    if (this.showNotificationDropdown) {
      this.loadRecentNotifications();
    }
  }

  loadRecentNotifications(): void {
    if (!this.currentStaff?.id) return;

    this.notificationService.GetUnreadNotifications(this.currentStaff.id).subscribe({
      next: (notifications) => {
        this.recentNotifications = notifications.slice(0, 10);
      },
      error: (err) => {
        console.log('Error loading notifications:', err);
      }
    });
  }

  markAllAsRead(): void {
    if (!this.currentStaff?.id) return;
    this.notificationService.markAllAsRead(this.currentStaff.id).subscribe({
      next: () => {
        this.unreadNotificationCount = 0;
        this.loadRecentNotifications();
      },
      error: (err) => {
        console.log('Error marking all as read:', err);
      }
    });
  }

  markAsReadAndNavigate(idNotification: string, relatedEntityType?: string, relatedEntityId?: string): void {
    this.notificationService.markAsRead(idNotification).subscribe({
      next: () => {
        this.unreadNotificationCount = Math.max(0, this.unreadNotificationCount - 1);
        this.loadRecentNotifications();
        this.showNotificationDropdown = false;

        // Navigate based on related entity
        if (relatedEntityType && relatedEntityId) {
          const routeMap: Record<string, { path: string; useQueryParam: boolean }> = {
            'Task': { path: '/tasks', useQueryParam: false },
            'Lead': { path: '/lead-detail', useQueryParam: true },
            'Customer': { path: '/customer-detail', useQueryParam: true },
            'Contact': { path: '/contact-detail', useQueryParam: true },
            'Deal': { path: '/deal-detail', useQueryParam: true }
          };
          const route = routeMap[relatedEntityType];
          if (route) {
            if (route.useQueryParam) {
              this.router.navigate([route.path], { queryParams: { id: relatedEntityId } });
            } else {
              this.router.navigate([route.path, relatedEntityId]);
            }
          } else {
            this.router.navigate(['/notifications']);
          }
        } else {
          this.router.navigate(['/notifications']);
        }
      },
      error: (err) => {
        console.log('Error marking notification as read:', err);
      }
    });
  }

  getNotificationIcon(type: string): string {
    const icons: Record<string, string> = {
      'TASK_ASSIGNED': 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      'TASK_COMPLETED': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
      'DEAL_UPDATED': 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'CONTACT_STATUS_CHANGED': 'M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.355 0-2.697-.056-4.024-.166-1.133-.093-1.98-1.057-1.98-2.193v-4.286c0-.968.616-1.813 1.5-2.097V4.5a2.25 2.25 0 012.25-2.25h7.5A2.25 2.25 0 0120.25 4.5v4z',
      'MENTION': 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      'SYSTEM': 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      'NotificationReminder': 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
    };
    return icons[type] || icons['SYSTEM'];
  }

  getNotificationTypeClass(type: string): string {
    if (this.themeConfig().id === 'dark') {
      const darkColors: Record<string, string> = {
        'TASK_ASSIGNED': 'bg-blue-900/50 text-blue-300',
        'TASK_COMPLETED': 'bg-green-900/50 text-green-300',
        'DEAL_UPDATED': 'bg-amber-900/50 text-amber-300',
        'CONTACT_STATUS_CHANGED': 'bg-purple-900/50 text-purple-300',
        'MENTION': 'bg-cyan-900/50 text-cyan-300',
        'SYSTEM': 'bg-slate-700 text-slate-300',
        'NotificationReminder': 'bg-orange-900/50 text-orange-300'
      };
      return darkColors[type] || darkColors['SYSTEM'];
    }
    const colors: Record<string, string> = {
      'TASK_ASSIGNED': 'bg-blue-100 text-blue-600',
      'TASK_COMPLETED': 'bg-green-100 text-green-600',
      'DEAL_UPDATED': 'bg-amber-100 text-amber-600',
      'CONTACT_STATUS_CHANGED': 'bg-purple-100 text-purple-600',
      'MENTION': 'bg-cyan-100 text-cyan-600',
      'SYSTEM': 'bg-slate-100 text-slate-600',
      'NotificationReminder': 'bg-orange-100 text-orange-600'
    };
    return colors[type] || colors['SYSTEM'];
  }

  formatNotificationTime(dateStr: string): string {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Vừa xong';
    if (diffMins < 60) return `${diffMins} phút trước`;
    if (diffHours < 24) return `${diffHours} giờ trước`;
    if (diffDays < 7) return `${diffDays} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('.notification-container')) {
      this.showNotificationDropdown = false;
    }
  }

  ngAfterViewChecked(): void {
    // this.scrollToBottom();
  }

  scrollToBottom() {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch(err) {}
  }

  showChatThinking() {
    this.isChatThinking = true;

    setTimeout(() => {
      this.isChatThinking = false;
    },15000);
  }

  isAdmin(): boolean {
    return this.currentStaff?.role === 'ADMIN';
  }

  isRouteActive(path: string, exact?: boolean): boolean {
    return this.router.isActive(path, exact ?? false);
  }

  onLogout(event?: Event){
    if (event) event.preventDefault();
    this.showLogoutDialog = true;
  }

  confirmLogout(): void {
    this.showLogoutDialog = false;
    this.authenService.logout().subscribe({
      next: (res) => {
        if ((res as any)?.errors && (res as any)?.errors?.length > 0) {
          this.toastService.error((res as any).errors[0].message);
          return;
        }

        this.toastService.success('Đăng xuất thành công');
        setTimeout(() => {
          this.router.navigate(['/authen']);
        }, 500);
      },
      error: (err) => {
        this.toastService.error('Đăng xuất thất bại');
      }
    });
  }

  cancelLogout(): void {
    this.showLogoutDialog = false;
  }

  onListHistoryMessage(idStaff: string){
    if (!idStaff) return;
    this.aiService.ListHistoryMessage(idStaff).subscribe({
      next: (res) => {
        this.historyMessageItem = res ?? [];
      },
      error: (err) => {
        console.log("Error: ", err);
      }
    });
  }

  loadWelcomeMessage() {
    this.aiService.GetWelcomeMessage().subscribe({
      next: (msg) => {
        if (msg && this.historyMessageItem.length === 0) {
          this.historyMessageItem.push({ role: 'model', message: msg });
        }
      },
      error: (err) => {
        console.log("Error loading welcome: ", err);
      }
    });
  }

  clearChatHistory() {
    if (!this.currentStaff?.id) return;
    this.aiService.DeleteMessage(this.currentStaff.id).subscribe({
      next: () => {
        this.historyMessageItem = [];
        this.loadWelcomeMessage();
        this.toastService.success('Đã xóa lịch sử trò chuyện');
      },
      error: (err) => {
        console.log("Error clearing: ", err);
        this.toastService.error('Xóa lịch sử thất bại');
      }
    });
  }

  sendMessage() {
    const message = this.newMessage.trim();
    if (!message || !this.currentStaff) return;

    this.historyMessageItem.push({ role: 'user', message: message });
    this.newMessage = '';

    this.aiTyping = true;

    this.aiService.ChatWithAI(this.currentStaff.id, message).subscribe({
      next: (aiMsg) => {
        this.aiTyping = false;
        if (aiMsg?.aiResponse) {
          this.historyMessageItem.push({ role: 'model', message: aiMsg.aiResponse });
          setTimeout(() => this.scrollToBottom(), 50);
        }
      },
      error: (err) => {
        this.aiTyping = false;
        console.log("Error: ", err);
        this.historyMessageItem.push({ role: 'model', message: 'Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.' });
      }
    });
  }

  toggleChat() {
    this.isChatOpen = !this.isChatOpen;
    this.isChatBoxOpen = !this.isChatOpen;
  }
}