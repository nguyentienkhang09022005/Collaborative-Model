import { PersonInfo } from './staff.model';

export interface NotificationItem {
  idNotification: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  isPinned: boolean;
  createdAt: string;
  idStaff: string;
  staff?: NotificationStaffItem;
  relatedEntityType?: string;
  relatedEntityId?: string;
}

export interface NotificationStaffItem {
  id: string;
  person: PersonInfo;
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  totalUnread: number;
}

export interface NotificationResponse {
  errors?: { message: string }[];
  data: {
    notifications: NotificationItem[];
    unreadNotifications: NotificationItem[];
    pinnedNotifications: NotificationItem[];
    notificationById: NotificationItem[];
  };
}

export interface NotificationMutationResponse {
  errors?: { message: string }[];
  data: {
    markAsRead: NotificationItem;
    markAllAsRead: boolean;
    pinNotification: NotificationItem;
    deleteNotification: string;
  };
}

export const NOTIFICATION_TYPE_LABELS: Record<string, string> = {
  'TASK_ASSIGNED': 'Task Assigned',
  'TASK_COMPLETED': 'Task Completed',
  'DEAL_UPDATED': 'Deal Updated',
  'CONTACT_STATUS_CHANGED': 'Contact Status Changed',
  'MENTION': 'Mentioned',
  'SYSTEM': 'System',
  'NotificationReminder': 'Reminder'
};

export const NOTIFICATION_TYPE_COLORS: Record<string, string> = {
  'TASK_ASSIGNED': 'bg-blue-100 text-blue-700',
  'TASK_COMPLETED': 'bg-green-100 text-green-700',
  'DEAL_UPDATED': 'bg-amber-100 text-amber-700',
  'CONTACT_STATUS_CHANGED': 'bg-purple-100 text-purple-700',
  'MENTION': 'bg-cyan-100 text-cyan-700',
  'SYSTEM': 'bg-slate-100 text-slate-600',
  'NotificationReminder': 'bg-orange-100 text-orange-700'
};