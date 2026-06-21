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
import { LogoComponent } from '../../shared/components/logo/logo.component';

export type AiBlockType = 'section' | 'empty' | 'paragraph';

export interface AiItem {
  label: string;
  count?: number;
  countLabel?: string;
  badge?: string;
  isEmpty?: boolean;
}

export interface AiBlock {
  type: AiBlockType;
  title?: string;
  iconKind?: string;
  items?: AiItem[];
  text?: string;
}

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule, FormsModule, ToastComponent, ConfirmDialogComponent, LogoComponent],
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
            'Task': { path: '/app/tasks', useQueryParam: false },
            'Lead': { path: '/app/lead-detail', useQueryParam: true },
            'Customer': { path: '/app/customer-detail', useQueryParam: true },
            'Contact': { path: '/app/contact-detail', useQueryParam: true },
            'Deal': { path: '/app/deal-detail', useQueryParam: true }
          };
          const route = routeMap[relatedEntityType];
          if (route) {
            if (route.useQueryParam) {
              this.router.navigate([route.path], { queryParams: { id: relatedEntityId } });
            } else {
              this.router.navigate([route.path, relatedEntityId]);
            }
          } else {
            this.router.navigate(['/app/notifications']);
          }
        } else {
          this.router.navigate(['/app/notifications']);
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

  // ── AI board rendering ─────────────────────────────────────────────────

  parseAiContent(text: string): AiBlock[] {
    if (!text || !text.trim()) {
      return [{ type: 'paragraph', text: '' }];
    }

    const rawLines = text.split('\n');
    const lines = rawLines
      .map(l => l.trim())
      .filter(l => l !== '');

    const sections: AiBlock[] = [];
    let current: AiBlock | null = null;

    const flush = () => {
      if (!current) return;
      const hasTitle = !!current.title;
      const hasItems = (current.items?.length ?? 0) > 0;
      if (hasTitle || hasItems) sections.push(current);
      current = null;
    };

    const isEmptyMarker = (s: string) =>
      /^\(\s*[Kk]hông có[^)]*\)\s*$/.test(s) ||
      /^\(\s*[Nn]o data[^)]*\)\s*$/.test(s) ||
      /^\(\s*[Ee]mpty[^)]*\)\s*$/.test(s) ||
      /^N\/?A$/i.test(s) ||
      /^-$/.test(s);

    let hasAnyHeader = false;
    let hasAnyBullet = false;
    for (const l of lines) {
      if (/^\*\*.+?:\*\*\s*$/.test(l)) hasAnyHeader = true;
      if (/^[-•]\s+/.test(l)) hasAnyBullet = true;
    }

    for (const line of lines) {
      // Section header: **Title:**
      const headingMatch = line.match(/^\*\*(.+?):\*\*\s*$/);
      if (headingMatch) {
        flush();
        const title = headingMatch[1].trim();
        current = {
          type: 'section',
          title,
          iconKind: this.detectIconKind(title),
          items: []
        };
        continue;
      }

      // Empty marker line
      if (isEmptyMarker(line)) {
        if (current && current.type === 'section') {
          current.items = current.items ?? [];
          current.items.push({ label: line.replace(/[()]/g, '').trim() || '(Không có dữ liệu)', isEmpty: true });
        } else {
          sections.push({ type: 'empty', text: line });
        }
        continue;
      }

      // Bullet item: - Item text
      const bulletMatch = line.match(/^[-•]\s+(.+)$/);
      if (bulletMatch) {
        if (!current) {
          current = {
            type: 'section',
            title: hasAnyHeader ? '' : 'Kết quả',
            iconKind: hasAnyHeader ? 'info' : 'stats',
            items: []
          };
        }
        const item = this.parseAiItem(bulletMatch[1]);
        current.items = current.items ?? [];
        current.items.push(item);
        continue;
      }

      // Plain text — close any section, push as paragraph
      flush();
      sections.push({ type: 'paragraph', text: line });
    }

    flush();

    // Fallback: if no headers but has bullets, give it a default title
    if (!hasAnyHeader && hasAnyBullet && sections.length === 1) {
      const only = sections[0];
      if (only.type === 'section' && !only.title) {
        only.title = 'Kết quả';
        only.iconKind = 'stats';
      }
    }

    return sections;
  }

  private parseAiItem(raw: string): AiItem {
    let s = raw.trim();

    // Extract count badge: (3 lead), (5 contact)
    const countMatch = s.match(/^(.+?)\s*\((\d+)\s+([^)]+)\)\s*(.*)$/);
    if (countMatch) {
      const label = countMatch[1].trim();
      const rest = countMatch[4]?.trim() ?? '';
      const item: AiItem = {
        label,
        count: parseInt(countMatch[2], 10),
        countLabel: countMatch[3].trim(),
      };
      if (rest) {
        const cleaned = rest.replace(/^[\s,;:.–-]+/, '').trim();
        if (cleaned) item.badge = cleaned;
      }
      return item;
    }

    // Extract status badge: trailing words like "Updated", "Mới", "Cập nhật"
    // Match with optional trailing punctuation
    const statusWords = [
      'Updated', 'New', 'Pending', 'Done', 'Closed', 'Won', 'Lost',
      'Mới', 'Cập nhật', 'Đang chờ', 'Hoàn thành', 'Đã đóng', 'Thắng', 'Thua',
      'Hot', 'Warm', 'Cold', 'Nóng', 'Ấm', 'Lạnh'
    ];
    for (const w of statusWords) {
      const idx = s.lastIndexOf(w);
      if (idx === -1) continue;
      const after = idx + w.length;
      // Character after word must be non-alphanumeric or end of string
      if (after < s.length && /[\w]/.test(s.charAt(after))) continue;
      // Character before word must be start of string or non-alphanumeric (word boundary)
      if (idx > 0 && /[\w]/.test(s.charAt(idx - 1))) continue;
      // Found a status word at a word boundary
      const label = s.substring(0, idx).trim().replace(/[\s,;:.–-]+$/, '').trim();
      if (label) {
        return { label, badge: w };
      }
    }

    return { label: s };
  }

  private detectIconKind(title: string): string {
    const t = title.toLowerCase();
    if (/(lead)/.test(t)) return 'lead';
    if (/(customer|khách hàng)/.test(t)) return 'customer';
    if (/(contact|liên hệ)/.test(t)) return 'contact';
    if (/(deal|cơ hội|giao dịch)/.test(t)) return 'deal';
    if (/(task|công việc|nhiệm vụ)/.test(t)) return 'task';
    if (/(doanh thu|revenue|tổng)/.test(t)) return 'revenue';
    if (/(cảnh báo|warning|rủi ro)/.test(t)) return 'warning';
    if (/(đề xuất|gợi ý|khuyến nghị|suggest|gợi ý|hành động)/.test(t)) return 'suggestion';
    if (/(phân tích|analysis|chi tiết)/.test(t)) return 'analysis';
    if (/(thống kê|summary|tổng quan|tóm tắt)/.test(t)) return 'stats';
    if (/(ngày|date|thời gian|hôm nay|tuần|tháng)/.test(t)) return 'calendar';
    if (/(xu hướng|trend|tiến độ)/.test(t)) return 'trend';
    return 'info';
  }

  getBlockIconPath(kind: string): string {
    const map: Record<string, string> = {
      lead: 'M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z',
      customer: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z',
      contact: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
      deal: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
      task: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
      revenue: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      warning: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z',
      suggestion: 'M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z',
      analysis: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z',
      stats: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
      calendar: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
      trend: 'M13 7h8m0 0v8m0-8l-8 8-4-4-6 6',
      info: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
    };
    return map[kind] || map['info'];
  }

  getBlockIconBgClass(kind: string): string {
    const isDark = this.themeConfig().id === 'dark';
    const lightMap: Record<string, string> = {
      lead: 'bg-blue-100 text-blue-600',
      customer: 'bg-emerald-100 text-emerald-600',
      contact: 'bg-cyan-100 text-cyan-600',
      deal: 'bg-violet-100 text-violet-600',
      task: 'bg-amber-100 text-amber-600',
      revenue: 'bg-emerald-100 text-emerald-600',
      warning: 'bg-rose-100 text-rose-600',
      suggestion: 'bg-amber-100 text-amber-600',
      analysis: 'bg-sky-100 text-sky-600',
      stats: 'bg-indigo-100 text-indigo-600',
      calendar: 'bg-orange-100 text-orange-600',
      trend: 'bg-teal-100 text-teal-600',
      info: 'bg-slate-100 text-slate-600'
    };
    const darkMap: Record<string, string> = {
      lead: 'bg-blue-900/50 text-blue-300',
      customer: 'bg-emerald-900/50 text-emerald-300',
      contact: 'bg-cyan-900/50 text-cyan-300',
      deal: 'bg-violet-900/50 text-violet-300',
      task: 'bg-amber-900/50 text-amber-300',
      revenue: 'bg-emerald-900/50 text-emerald-300',
      warning: 'bg-rose-900/50 text-rose-300',
      suggestion: 'bg-amber-900/50 text-amber-300',
      analysis: 'bg-sky-900/50 text-sky-300',
      stats: 'bg-indigo-900/50 text-indigo-300',
      calendar: 'bg-orange-900/50 text-orange-300',
      trend: 'bg-teal-900/50 text-teal-300',
      info: 'bg-slate-700 text-slate-300'
    };
    const m = isDark ? darkMap : lightMap;
    return m[kind] || m['info'];
  }

  getBadgeClass(badge: string): string {
    const b = badge.toLowerCase();
    const isDark = this.themeConfig().id === 'dark';
    let tone = 'slate';
    if (/(updated|cập nhật|hoàn thành|done|won|thắng|closed|đã đóng|new|mới)/.test(b)) tone = 'emerald';
    else if (/(pending|đang chờ|hot|nóng|warning|cảnh báo)/.test(b)) tone = 'amber';
    else if (/(cold|lạnh|lost|thua)/.test(b)) tone = 'sky';
    else if (/(warm|ấm)/.test(b)) tone = 'orange';

    const lightMap: Record<string, string> = {
      emerald: 'bg-emerald-100 text-emerald-700',
      amber: 'bg-amber-100 text-amber-700',
      sky: 'bg-sky-100 text-sky-700',
      orange: 'bg-orange-100 text-orange-700',
      slate: 'bg-slate-100 text-slate-600'
    };
    const darkMap: Record<string, string> = {
      emerald: 'bg-emerald-900/40 text-emerald-300',
      amber: 'bg-amber-900/40 text-amber-300',
      sky: 'bg-sky-900/40 text-sky-300',
      orange: 'bg-orange-900/40 text-orange-300',
      slate: 'bg-slate-700 text-slate-300'
    };
    return (isDark ? darkMap : lightMap)[tone];
  }
}